import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { mockClasses, getAtRiskStudents, mockStudents, mockAuditLogs, mockAttendanceRecords, mockTerms } from '../lib/mockData';
import { BarChart, Download, TrendingUp, Users, Calendar, Home, FileText, AlertTriangle, Shield } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export function AdminReports() {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('week');

  // Get at-risk students data
  const atRiskStudents = getAtRiskStudents();

  // Mock report data
  const classReports = [
    {
      classId: 'c1',
      className: 'Mathematics 101',
      totalStudents: 24,
      avgAttendance: 92.5,
      presentToday: 22,
      absentToday: 2,
      trend: 'up',
    },
    {
      classId: 'c2',
      className: 'English Literature',
      totalStudents: 22,
      avgAttendance: 88.2,
      presentToday: 19,
      absentToday: 3,
      trend: 'down',
    },
    {
      classId: 'c3',
      className: 'Biology Lab',
      totalStudents: 20,
      avgAttendance: 95.0,
      presentToday: 19,
      absentToday: 1,
      trend: 'up',
    },
    {
      classId: 'c4',
      className: 'World History',
      totalStudents: 26,
      avgAttendance: 85.7,
      presentToday: 22,
      absentToday: 4,
      trend: 'stable',
    },
    {
      classId: 'c5',
      className: 'Chemistry',
      totalStudents: 18,
      avgAttendance: 91.1,
      presentToday: 16,
      absentToday: 2,
      trend: 'up',
    },
  ];

  const studentReports = [
    {
      studentId: 'STU001',
      name: 'Alex Anderson',
      class: 'Mathematics 101',
      attendanceRate: 98.0,
      daysAbsent: 1,
      daysLate: 0,
      status: 'excellent',
    },
    {
      studentId: 'STU002',
      name: 'Beth Brown',
      class: 'Mathematics 101',
      attendanceRate: 75.0,
      daysAbsent: 12,
      daysLate: 1,
      status: 'concern',
    },
    {
      studentId: 'STU011',
      name: 'Kevin King',
      class: 'English Literature',
      attendanceRate: 88.5,
      daysAbsent: 5,
      daysLate: 2,
      status: 'good',
    },
  ];

  const handleExport = () => {
    alert('Exporting report data... (This would generate a CSV/Excel file in production)');
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <div className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-600">Excellent</Badge>;
      case 'good':
        return <Badge variant="default">Good</Badge>;
      case 'concern':
        return <Badge variant="destructive">Needs Attention</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  // Helper to get student name
  const getStudentName = (studentId: string, classId: string) => {
    const students = mockStudents[classId];
    const student = students?.find((s) => s.id === studentId);
    return student ? { name: student.name, studentNumber: student.studentId } : { name: 'Unknown', studentNumber: 'N/A' };
  };
  
  // Helper to get class name
  const getClassName = (classId: string) => {
    const classData = mockClasses.find((c) => c.id === classId);
    return classData?.name || 'Unknown Class';
  };

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
            <BreadcrumbPage>Reports & Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator />

      {/* Header - Traditional .NET Style */}
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 pl-4 flex-1" style={{ borderLeftColor: '#003B5C' }}>
          <h2 style={{ color: '#003B5C' }}>Reports & Analytics Dashboard</h2>
          <p className="text-muted-foreground">View attendance trends, generate reports, and analyze student performance data</p>
        </div>
        <Button 
          onClick={handleExport} 
          className="border-2"
          style={{ backgroundColor: '#F26522', color: 'white', borderColor: '#F26522' }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {/* Critical Alert - At-Risk Students */}
      {atRiskStudents.length > 0 && (
        <div className="border-4 border-red-600 bg-red-50">
          <div className="bg-red-600 px-4 py-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-white" />
            <h3 className="text-sm text-white">CRITICAL: {atRiskStudents.length} STUDENTS REQUIRE IMMEDIATE ATTENTION</h3>
          </div>
          <div className="p-4">
            <p style={{ color: '#dc2626' }}>
              <strong>{atRiskStudents.length} student{atRiskStudents.length > 1 ? 's have' : ' has'}</strong> missed 3 or more classes in the last 10 days. Immediate intervention may be required to prevent academic failure and ensure student success.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Review the "At-Risk Students" tab below for detailed information and recommended actions.
            </p>
          </div>
        </div>
      )}

      {/* Filters - Traditional Panel */}
      <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>Report Filters</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Class Selection</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="border-2" style={{ borderColor: '#E8F4F8' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {mockClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-2" style={{ borderColor: '#E8F4F8' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="semester">This Semester</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics - Traditional Panel Style */}
      <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>Summary Statistics</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#003B5C', borderLeftWidth: '4px' }}>
              <div className="flex items-center justify-center mb-2">
                <BarChart className="h-6 w-6" style={{ color: '#003B5C' }} />
              </div>
              <label className="text-xs text-muted-foreground block">Overall Attendance</label>
              <p className="text-3xl mt-1" style={{ color: '#003B5C' }}>90.5%</p>
            </div>
            
            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#0066A1', borderLeftWidth: '4px' }}>
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6" style={{ color: '#0066A1' }} />
              </div>
              <label className="text-xs text-muted-foreground block">Total Students</label>
              <p className="text-3xl mt-1" style={{ color: '#0066A1' }}>110</p>
            </div>
            
            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#22c55e', borderLeftWidth: '4px' }}>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <label className="text-xs text-muted-foreground block">Present Today</label>
              <p className="text-3xl mt-1 text-green-600">98</p>
            </div>
            
            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#dc2626', borderLeftWidth: '4px' }}>
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <label className="text-xs text-muted-foreground block">At-Risk Students</label>
              <p className="text-3xl mt-1 text-red-600">{atRiskStudents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Tabs - Traditional Style */}
      <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
        <Tabs defaultValue="at-risk" className="w-full">
          <div className="bg-gray-50 border-b-2 px-4 py-2" style={{ borderBottomColor: '#003B5C' }}>
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="at-risk"
                className="data-[state=active]:bg-white data-[state=active]:border-2"
                style={{ borderColor: '#003B5C' }}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                At-Risk Students
              </TabsTrigger>
              <TabsTrigger 
                value="classes"
                className="data-[state=active]:bg-white data-[state=active]:border-2"
                style={{ borderColor: '#003B5C' }}
              >
                Class Reports
              </TabsTrigger>
              <TabsTrigger 
                value="students"
                className="data-[state=active]:bg-white data-[state=active]:border-2"
                style={{ borderColor: '#003B5C' }}
              >
                Student Reports
              </TabsTrigger>
              <TabsTrigger 
                value="audit"
                className="data-[state=active]:bg-white data-[state=active]:border-2"
                style={{ borderColor: '#003B5C' }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Audit Logs
              </TabsTrigger>
            </TabsList>
          </div>

          {/* At-Risk Students Tab */}
          <TabsContent value="at-risk" className="p-4">
            <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
              <div className="bg-red-600 border-b-2 px-4 py-3 flex items-center gap-2" style={{ borderBottomColor: '#dc2626' }}>
                <AlertTriangle className="h-5 w-5 text-white" />
                <h4 className="text-sm text-white">Students Requiring Immediate Intervention (3+ Absences in Last 10 Days)</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2" style={{ borderBottomColor: '#003B5C' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Priority</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Student ID</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Student Name</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Class</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Absences (Last 10 Days)</th>
                      <th className="px-4 py-3 text-left text-xs" style={{ color: '#003B5C' }}>Recent Absence Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atRiskStudents
                      .sort((a, b) => b.count - a.count)
                      .map((student, index) => {
                        const studentInfo = getStudentName(student.studentId, student.classId);
                        const className = getClassName(student.classId);
                        const isCritical = student.count >= 5;
                        
                        return (
                          <tr key={`${student.studentId}-${student.classId}`} className={`border-b ${isCritical ? 'bg-red-100' : index % 2 === 1 ? 'bg-red-50' : 'bg-white'}`}>
                            <td className="px-4 py-3 border-r">
                              {isCritical ? (
                                <span className="text-xs px-2 py-1 bg-red-600 text-white border-2 border-red-700">CRITICAL</span>
                              ) : (
                                <span className="text-xs px-2 py-1 bg-yellow-500 text-white border-2 border-yellow-600">WARNING</span>
                              )}
                            </td>
                            <td className="px-4 py-3 border-r text-sm">{studentInfo.studentNumber}</td>
                            <td className="px-4 py-3 border-r text-sm">{studentInfo.name}</td>
                            <td className="px-4 py-3 border-r text-sm">{className}</td>
                            <td className="px-4 py-3 border-r">
                              <span className="text-sm px-2 py-1 bg-red-600 text-white border-2 border-red-700">
                                {student.count} days
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {student.dates.sort().slice(-3).map((date) => new Date(date).toLocaleDateString()).join(', ')}
                              {student.dates.length > 3 && '...'}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="bg-red-50 border-t-2 px-4 py-3" style={{ borderTopColor: '#E8F4F8' }}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <p style={{ color: '#dc2626' }}>
                      <strong>Action Required:</strong> Contact these students and their guardians immediately. Document all communication attempts and outcomes.
                    </p>
                    <p className="text-muted-foreground mt-1">
                      Total At-Risk Students: {atRiskStudents.length} | Critical Cases (5+ absences): {atRiskStudents.filter((s) => s.count >= 5).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classes" className="p-4">
            <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
              <div className="bg-gray-100 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
                <h4 className="text-sm" style={{ color: '#003B5C' }}>Class Attendance Overview</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2" style={{ borderBottomColor: '#003B5C' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Class Name</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Total Students</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Avg Attendance</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Present Today</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Absent Today</th>
                      <th className="px-4 py-3 text-left text-xs" style={{ color: '#003B5C' }}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classReports.map((report, index) => (
                      <tr key={report.classId} className={`border-b ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="px-4 py-3 border-r text-sm">{report.className}</td>
                        <td className="px-4 py-3 border-r text-sm">{report.totalStudents}</td>
                        <td className="px-4 py-3 border-r">
                          <span className={`text-sm px-2 py-1 border ${report.avgAttendance >= 90 ? 'bg-green-50 border-green-600 text-green-700' : 'bg-yellow-50 border-yellow-600 text-yellow-700'}`}>
                            {report.avgAttendance}%
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r text-sm text-green-600">{report.presentToday}</td>
                        <td className="px-4 py-3 border-r text-sm text-red-600">{report.absentToday}</td>
                        <td className="px-4 py-3 text-sm">{getTrendIcon(report.trend)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 border-t-2 px-4 py-3 text-sm text-muted-foreground" style={{ borderTopColor: '#E8F4F8' }}>
                Total Records: {classReports.length}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students" className="p-4">
            <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
              <div className="bg-gray-100 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
                <h4 className="text-sm" style={{ color: '#003B5C' }}>Student Attendance Overview</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2" style={{ borderBottomColor: '#003B5C' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Student ID</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Name</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Class</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Attendance Rate</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Days Absent</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Days Late</th>
                      <th className="px-4 py-3 text-left text-xs" style={{ color: '#003B5C' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentReports.map((student, index) => (
                      <tr key={student.studentId} className={`border-b ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="px-4 py-3 border-r text-sm">{student.studentId}</td>
                        <td className="px-4 py-3 border-r text-sm">{student.name}</td>
                        <td className="px-4 py-3 border-r text-sm">{student.class}</td>
                        <td className="px-4 py-3 border-r text-sm">{student.attendanceRate}%</td>
                        <td className="px-4 py-3 border-r text-sm">{student.daysAbsent}</td>
                        <td className="px-4 py-3 border-r text-sm">{student.daysLate}</td>
                        <td className="px-4 py-3 text-sm">{getStatusBadge(student.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 border-t-2 px-4 py-3 text-sm text-muted-foreground" style={{ borderTopColor: '#E8F4F8' }}>
                Total Records: {studentReports.length}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="p-4">
            <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
              <div className="bg-gray-100 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
                <h4 className="text-sm" style={{ color: '#003B5C' }}>Audit Logs Overview</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2" style={{ borderBottomColor: '#003B5C' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>User</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Action</th>
                      <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAuditLogs.map((log, index) => (
                      <tr key={log.id} className={`border-b ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="px-4 py-3 border-r text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 border-r text-sm">{log.userName}</td>
                        <td className="px-4 py-3 border-r text-sm">{log.action}</td>
                        <td className="px-4 py-3 text-sm">{log.changes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 border-t-2 px-4 py-3 text-sm text-muted-foreground" style={{ borderTopColor: '#E8F4F8' }}>
                Total Records: {mockAuditLogs.length}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}