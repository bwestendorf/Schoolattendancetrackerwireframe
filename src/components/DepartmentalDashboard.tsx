import { useState } from 'react';
import { User } from '../types';
import { mockClasses, mockAttendanceRecords, mockTerms, getClassesMissingAttendance, getAttendanceCompletionByCRN } from '../lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Home, Calendar, Users, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface DepartmentalDashboardProps {
  user: User;
}

type ViewFilter = 'term' | 'instructor' | 'program';

export function DepartmentalDashboard({ user }: DepartmentalDashboardProps) {
  const [viewFilter, setViewFilter] = useState<ViewFilter>('term');
  const [selectedTerm, setSelectedTerm] = useState('F24');
  const [selectedInstructor, setSelectedInstructor] = useState('all');

  // Filter classes based on department access
  const departmentClasses = user.role === 'departmental'
    ? mockClasses.filter((c) => c.department === user.department)
    : mockClasses;

  // Further filter by term or instructor
  const getFilteredClasses = () => {
    let filtered = departmentClasses;

    if (viewFilter === 'term' && selectedTerm !== 'all') {
      filtered = filtered.filter((c) => c.termCode === selectedTerm);
    }

    if (viewFilter === 'instructor' && selectedInstructor !== 'all') {
      filtered = filtered.filter((c) => c.teacherName === selectedInstructor);
    }

    return filtered;
  };

  const filteredClasses = getFilteredClasses();

  // Get unique instructors from department classes
  const instructors = Array.from(new Set(departmentClasses.map((c) => c.teacherName)));

  // Calculate statistics
  const calculateStats = () => {
    const totalCreditHours = filteredClasses.reduce((sum, c) => sum + c.creditHours, 0);
    const totalEnrollment = filteredClasses.reduce((sum, c) => sum + c.studentCount, 0);
    
    // Calculate attendance completion percentage
    const completionRates = filteredClasses.map((c) => {
      const completion = getAttendanceCompletionByCRN(c.crn, c.startDate, new Date().toISOString().split('T')[0]);
      return completion;
    });
    const avgCompletion = completionRates.length > 0
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
      : 0;

    // Get missing attendance counts
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekStr = lastWeek.toISOString().split('T')[0];

    const missingToday = getClassesMissingAttendance(today).filter((c) =>
      filteredClasses.some((fc) => fc.id === c.id)
    ).length;

    const missingYesterday = getClassesMissingAttendance(yesterdayStr).filter((c) =>
      filteredClasses.some((fc) => fc.id === c.id)
    ).length;

    return {
      totalCRNs: filteredClasses.length,
      totalCreditHours,
      totalEnrollment,
      avgCompletion: Math.round(avgCompletion),
      missingToday,
      missingYesterday,
    };
  };

  const stats = calculateStats();

  // Get detailed CRN breakdown
  const getCRNBreakdown = () => {
    return filteredClasses.map((classData) => {
      const completion = getAttendanceCompletionByCRN(
        classData.crn,
        classData.startDate,
        new Date().toISOString().split('T')[0]
      );
      
      // Count records for this CRN
      const records = mockAttendanceRecords.filter((r) => r.crn === classData.crn);
      const presentCount = records.filter((r) => r.status === 'present').length;
      const absentCount = records.filter((r) => r.status === 'absent').length;
      const lateCount = records.filter((r) => r.status === 'late').length;
      const excusedCount = records.filter((r) => r.status === 'excused').length;
      
      const totalRecords = records.length;
      const attendanceRate = totalRecords > 0 
        ? ((presentCount + lateCount) / totalRecords) * 100 
        : 0;

      return {
        ...classData,
        completion: Math.round(completion),
        attendanceRate: Math.round(attendanceRate),
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
      };
    });
  };

  const crnBreakdown = getCRNBreakdown();

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
            <BreadcrumbPage>Departmental Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator />

      {/* Page Header */}
      <div className="border-l-4 pl-4" style={{ borderLeftColor: '#003B5C' }}>
        <h2 style={{ color: '#003B5C' }}>
          {user.department ? `${user.department} Department` : 'Departmental'} Dashboard
        </h2>
        <p className="text-muted-foreground">
          View attendance statistics and completion rates by term, instructor, or full program
        </p>
      </div>

      {/* Filters */}
      <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>View Filters</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Filter By</label>
              <Select value={viewFilter} onValueChange={(v) => setViewFilter(v as ViewFilter)}>
                <SelectTrigger className="border-2" style={{ borderColor: '#E8F4F8' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term">By Term</SelectItem>
                  <SelectItem value="instructor">By Instructor</SelectItem>
                  <SelectItem value="program">Full Program</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {viewFilter === 'term' && (
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Select Term</label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="border-2" style={{ borderColor: '#E8F4F8' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    {mockTerms.map((term) => (
                      <SelectItem key={term.code} value={term.code}>
                        {term.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {viewFilter === 'instructor' && (
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Select Instructor</label>
                <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                  <SelectTrigger className="border-2" style={{ borderColor: '#E8F4F8' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Instructors</SelectItem>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor} value={instructor}>
                        {instructor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border-2 p-4" style={{ borderColor: '#E8F4F8', borderLeftColor: '#003B5C', borderLeftWidth: '4px' }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5" style={{ color: '#003B5C' }} />
            <label className="text-xs text-muted-foreground">Total CRNs</label>
          </div>
          <p className="text-3xl" style={{ color: '#003B5C' }}>{stats.totalCRNs}</p>
        </div>

        <div className="border-2 p-4" style={{ borderColor: '#E8F4F8', borderLeftColor: '#0066A1', borderLeftWidth: '4px' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5" style={{ color: '#0066A1' }} />
            <label className="text-xs text-muted-foreground">Total Credit Hours</label>
          </div>
          <p className="text-3xl" style={{ color: '#0066A1' }}>{stats.totalCreditHours}</p>
        </div>

        <div className="border-2 p-4" style={{ borderColor: '#E8F4F8', borderLeftColor: '#22c55e', borderLeftWidth: '4px' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5" style={{ color: '#22c55e' }} />
            <label className="text-xs text-muted-foreground">Total Enrollment</label>
          </div>
          <p className="text-3xl" style={{ color: '#22c55e' }}>{stats.totalEnrollment}</p>
        </div>

        <div className="border-2 p-4" style={{ borderColor: '#E8F4F8', borderLeftColor: '#F26522', borderLeftWidth: '4px' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" style={{ color: '#F26522' }} />
            <label className="text-xs text-muted-foreground">Avg. Attendance Completion</label>
          </div>
          <p className="text-3xl" style={{ color: '#F26522' }}>{stats.avgCompletion}%</p>
        </div>

        <div className="border-2 p-4" style={{ borderColor: '#E8F4F8', borderLeftColor: '#dc2626', borderLeftWidth: '4px' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" style={{ color: '#dc2626' }} />
            <label className="text-xs text-muted-foreground">Missing Attendance (Today)</label>
          </div>
          <p className="text-3xl" style={{ color: '#dc2626' }}>{stats.missingToday}</p>
        </div>

        <div className="border-2 p-4" style={{ borderColor: '#E8F4F8', borderLeftColor: '#9333ea', borderLeftWidth: '4px' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" style={{ color: '#9333ea' }} />
            <label className="text-xs text-muted-foreground">Missing Attendance (Yesterday)</label>
          </div>
          <p className="text-3xl" style={{ color: '#9333ea' }}>{stats.missingYesterday}</p>
        </div>
      </div>

      {/* Detailed CRN Breakdown */}
      <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>
            CRN Breakdown ({crnBreakdown.length} courses)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CRN</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Term</TableHead>
                <TableHead className="text-center">Credit Hours</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-center">Completion %</TableHead>
                <TableHead className="text-center">Attendance Rate</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crnBreakdown.map((item, index) => (
                <TableRow key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <TableCell>
                    <span style={{ color: '#003B5C' }}>{item.crn}</span>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.teacherName}</TableCell>
                  <TableCell>{item.term}</TableCell>
                  <TableCell className="text-center">{item.creditHours}</TableCell>
                  <TableCell className="text-center">{item.studentCount}</TableCell>
                  <TableCell className="text-center">
                    <span
                      style={{
                        color:
                          item.completion >= 80
                            ? '#22c55e'
                            : item.completion >= 60
                            ? '#F26522'
                            : '#dc2626',
                      }}
                    >
                      {item.completion}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      style={{
                        color:
                          item.attendanceRate >= 90
                            ? '#22c55e'
                            : item.attendanceRate >= 75
                            ? '#F26522'
                            : '#dc2626',
                      }}
                    >
                      {item.attendanceRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.completion >= 80 ? (
                      <span className="text-xs px-2 py-1 border-2 border-green-600 text-green-600">
                        On Track
                      </span>
                    ) : item.completion >= 60 ? (
                      <span className="text-xs px-2 py-1 border-2 border-orange-600 text-orange-600">
                        Needs Attention
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 border-2 border-red-600 text-red-600">
                        Critical
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}