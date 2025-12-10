import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { User } from '../types';
import { mockClasses, mockStudents, mockAttendanceRecords, getConsecutiveAbsences, mockSubstituteAssignments } from '../lib/mockData';
import { ArrowLeft, Calendar, Save, CheckCircle, XCircle, AlertTriangle, Home, Printer, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
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

interface ClassAttendanceInlineProps {
  user: User;
  classId: string;
  onBack: () => void;
}

type AttendanceStatus = 'present' | 'absent';
type ViewMode = 'daily' | 'weekly' | 'full';

interface StudentAttendance {
  studentId: string;
  status: AttendanceStatus;
}

export function ClassAttendanceInline({ user, classId, onBack }: ClassAttendanceInlineProps) {
  const classData = mockClasses.find((c) => c.id === classId);
  const allStudents = mockStudents[classId] || [];
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, StudentAttendance>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDroppedStudents, setShowDroppedStudents] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const printRef = useRef<HTMLDivElement>(null);

  // Check if current user is a substitute
  const isSubstitute = user.role === 'guest-teacher';
  const hasSubAssignment = mockSubstituteAssignments.some(
    (sub) => sub.classId === classId && sub.substituteId === user.id && sub.isActive
  );

  // Filter students based on show/hide dropped toggle
  const students = showDroppedStudents 
    ? allStudents 
    : allStudents.filter((s) => !s.isDropped);

  useEffect(() => {
    // Load existing attendance for the selected date
    const dateAttendance: Record<string, StudentAttendance> = {};
    allStudents.forEach((student) => {
      const record = mockAttendanceRecords.find(
        (r) => r.studentId === student.id && r.classId === classId && r.date === selectedDate
      );
      dateAttendance[student.id] = {
        studentId: student.id,
        status: record?.status || 'present',
      };
    });
    setAttendance(dateAttendance);
    setHasUnsavedChanges(false);
  }, [selectedDate, classId, allStudents]);

  // Check if date is within current academic year (August - July)
  const isWithinAcademicYear = (date: string): boolean => {
    const selectedDateObj = new Date(date);
    const year = selectedDateObj.getFullYear();
    const month = selectedDateObj.getMonth(); // 0-11
    
    // Academic year: August (month 7) of current year to July (month 6) of next year
    const academicYearStart = new Date(month >= 7 ? year : year - 1, 7, 1); // August 1st
    const academicYearEnd = new Date(month >= 7 ? year + 1 : year, 6, 31); // July 31st
    
    return selectedDateObj >= academicYearStart && selectedDateObj <= academicYearEnd;
  };

  const updateStatus = (studentId: string, newStatus: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: newStatus,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend with audit log
    console.log('Saving attendance:', {
      attendance,
      markedBy: user.name,
      markedByRole: isSubstitute ? 'substitute' : 'instructor',
      date: selectedDate,
      crn: classData?.crn,
    });
    setHasUnsavedChanges(false);
    alert('Attendance saved successfully!');
  };

  // Single-click bulk actions
  const markAllAs = (status: AttendanceStatus) => {
    const newAttendance: Record<string, StudentAttendance> = {};
    students.forEach((student) => {
      newAttendance[student.id] = {
        ...attendance[student.id],
        status,
      };
    });
    setAttendance(newAttendance);
    setHasUnsavedChanges(true);
  };

  // Select All (Present)
  const selectAll = () => {
    markAllAs('present');
  };

  // Deselect All (revert to default or clear)
  const deselectAll = () => {
    const newAttendance: Record<string, StudentAttendance> = {};
    students.forEach((student) => {
      newAttendance[student.id] = {
        studentId: student.id,
        status: 'present',
      };
    });
    setAttendance(newAttendance);
    setHasUnsavedChanges(true);
  };

  // Recommended: Based on last 3 consecutive sessions
  const applyRecommended = () => {
    const newAttendance: Record<string, StudentAttendance> = {};
    students.forEach((student) => {
      // Get last 3 attendance records for this student
      const recentRecords = mockAttendanceRecords
        .filter((r) => r.studentId === student.id && r.classId === classId && r.date < selectedDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

      // If student was present in all last 3 sessions, recommend present
      const allPresent = recentRecords.length === 3 && recentRecords.every((r) => r.status === 'present');
      const recommendedStatus: AttendanceStatus = allPresent ? 'present' : attendance[student.id]?.status || 'present';

      newAttendance[student.id] = {
        studentId: student.id,
        status: recommendedStatus,
      };
    });
    setAttendance(newAttendance);
    setHasUnsavedChanges(true);
  };

  // Print roster functionality
  const handlePrint = () => {
    window.print();
  };

  const stats = {
    present: Object.values(attendance).filter((a) => a.status === 'present').length,
    absent: Object.values(attendance).filter((a) => a.status === 'absent').length,
  };

  if (!classData) {
    return <div>Class not found</div>;
  }

  const canEdit = isWithinAcademicYear(selectedDate);

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="print:hidden">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              href="#" 
              className="flex items-center gap-1" 
              onClick={onBack}
              aria-label="Navigate to home"
            >
              <Home className="h-3 w-3" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={onBack}>My Classes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{classData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator className="print:hidden" />

      {/* Header - Traditional .NET Style */}
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 pl-4 flex-1" style={{ borderLeftColor: '#003B5C' }}>
          <div className="flex items-center gap-2 mb-2 print:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="border-2"
              style={{ borderColor: '#003B5C', color: '#003B5C' }}
              aria-label="Back to classes list"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Classes
            </Button>
          </div>
          <h2 style={{ color: '#003B5C' }} className="print:text-xl">{classData.name}</h2>
          <p className="text-muted-foreground">
            CRN: {classData.crn} • {classData.grade} • Instructor: {classData.teacherName}
          </p>
          {isSubstitute && hasSubAssignment && (
            <p className="text-sm mt-1" style={{ color: '#F26522' }}>
              <strong>Substitute Mode:</strong> You are recording attendance as a substitute teacher
            </p>
          )}
          {!canEdit && (
            <p className="text-sm mt-1" style={{ color: '#dc2626' }}>
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>Read-Only:</strong> Attendance can only be edited for the current academic year (August-July)
            </p>
          )}
        </div>
        <div className="flex gap-2 print:hidden">
          <Button 
            onClick={handlePrint} 
            variant="outline"
            className="border-2"
            style={{ borderColor: '#003B5C', color: '#003B5C' }}
            aria-label="Print attendance roster"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Roster
          </Button>
          {hasUnsavedChanges && canEdit && (
            <Button 
              onClick={handleSave} 
              className="border-2"
              style={{ backgroundColor: '#F26522', color: 'white', borderColor: '#F26522' }}
              aria-label="Save attendance changes"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Attendance Changes
            </Button>
          )}
        </div>
      </div>

      {/* View Options and Date Selector */}
      <div className="border-2 bg-white print:hidden" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>View Options & Date Selection</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Selector */}
            <div className="border-2 p-4 bg-gray-50" style={{ borderColor: '#E8F4F8' }}>
              <Label htmlFor="date-select" className="text-xs text-muted-foreground block mb-2">
                Select Date
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: '#003B5C' }} aria-hidden="true" />
                <input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 px-2 py-1 border-2 text-sm"
                  style={{ borderColor: '#E8F4F8' }}
                  max={new Date().toISOString().split('T')[0]}
                  aria-label="Select attendance date"
                />
              </div>
            </div>

            {/* View Mode */}
            <div className="border-2 p-4 bg-gray-50" style={{ borderColor: '#E8F4F8' }}>
              <Label htmlFor="view-mode" className="text-xs text-muted-foreground block mb-2">
                View Mode
              </Label>
              <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <SelectTrigger 
                  id="view-mode" 
                  className="border-2" 
                  style={{ borderColor: '#E8F4F8' }}
                  aria-label="Select view mode"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily View</SelectItem>
                  <SelectItem value="weekly">Weekly View (Coming Soon)</SelectItem>
                  <SelectItem value="full">Full Course View (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show/Hide Dropped Students */}
            <div className="border-2 p-4 bg-gray-50" style={{ borderColor: '#E8F4F8' }}>
              <Label htmlFor="show-dropped" className="text-xs text-muted-foreground block mb-2">
                Display Options
              </Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-dropped"
                  checked={showDroppedStudents}
                  onCheckedChange={setShowDroppedStudents}
                  aria-label="Toggle show dropped students"
                />
                <Label htmlFor="show-dropped" className="text-sm cursor-pointer">
                  {showDroppedStudents ? (
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Showing Dropped Students
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <EyeOff className="h-4 w-4" />
                      Hiding Dropped Students
                    </span>
                  )}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>
            Attendance Summary for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stats */}
            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#22c55e', borderLeftWidth: '4px' }}>
              <label className="text-xs text-muted-foreground block">Present</label>
              <p className="text-2xl" style={{ color: '#22c55e' }} aria-label={`${stats.present} students present`}>
                {stats.present}
              </p>
            </div>

            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#dc2626', borderLeftWidth: '4px' }}>
              <label className="text-xs text-muted-foreground block">Absent</label>
              <p className="text-2xl" style={{ color: '#dc2626' }} aria-label={`${stats.absent} students absent`}>
                {stats.absent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {canEdit && (
        <div className="border-2 p-4 bg-gray-50 print:hidden" style={{ borderColor: '#E8F4F8' }}>
          <label className="text-xs block mb-3" style={{ color: '#003B5C' }}>
            Quick Actions (Single Click):
          </label>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-2 w-full"
              style={{ borderColor: '#22c55e', color: '#22c55e' }}
              onClick={selectAll}
              aria-label="Mark all students as present"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2 w-full"
              style={{ borderColor: '#666', color: '#666' }}
              onClick={deselectAll}
              aria-label="Deselect all or reset attendance"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Deselect All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2 w-full"
              style={{ borderColor: '#0066A1', color: '#0066A1' }}
              onClick={applyRecommended}
              aria-label="Apply recommended attendance based on last 3 sessions"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Recommended
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2 w-full"
              style={{ borderColor: '#dc2626', color: '#dc2626' }}
              onClick={() => markAllAs('absent')}
              aria-label="Mark all students as absent"
            >
              <XCircle className="h-4 w-4 mr-1" />
              All Absent
            </Button>
          </div>
        </div>
      )}

      {/* Attendance Cards - Mobile First Design */}
      <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>
            Student Attendance Records ({students.length} students)
          </h3>
        </div>
        <div className="divide-y-2" style={{ borderColor: '#E8F4F8' }}>
          {students.map((student) => {
            const studentAttendance = attendance[student.id];
            const consecutive = getConsecutiveAbsences(student.id, classId, selectedDate);
            const hasConsecutiveAbsences = consecutive.count >= 3;
            
            // Check if this record was marked by substitute
            const existingRecord = mockAttendanceRecords.find(
              (r) => r.studentId === student.id && r.classId === classId && r.date === selectedDate
            );
            const markedBySubstitute = existingRecord?.markedByRole === 'substitute';
            
            return (
              <div 
                key={student.id}
                className={`p-4 ${hasConsecutiveAbsences ? 'bg-red-50 border-l-4 border-l-red-600' : 'bg-white'}`}
                role="region"
                aria-label={`Attendance for ${student.name}`}
              >
                {/* Student Info */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm" style={{ color: '#003B5C' }}>
                        {student.name}
                        {student.isDropped && (
                          <span className="ml-2 text-xs px-2 py-0.5 border border-gray-400 text-gray-600">
                            DROPPED {student.droppedDate && `- ${new Date(student.droppedDate).toLocaleDateString()}`}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
                      {markedBySubstitute && (
                        <p className="text-xs mt-1 px-2 py-0.5 inline-block" style={{ backgroundColor: '#FFF4E6', color: '#F26522', border: '1px solid #F26522' }}>
                          Marked by Substitute
                        </p>
                      )}
                    </div>
                    {hasConsecutiveAbsences && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="flex items-center gap-1 border-2 border-red-600 px-2 py-1 shrink-0"
                              role="alert"
                              aria-label={`${consecutive.count} consecutive absences`}
                            >
                              <AlertTriangle className="h-3 w-3 text-red-600" aria-hidden="true" />
                              <span className="text-xs text-red-600">{consecutive.count} Consecutive</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-semibold">Consecutive absences:</p>
                              <ul className="text-sm space-y-0.5">
                                {consecutive.dates.map((date) => (
                                  <li key={date}>• {new Date(date).toLocaleDateString()}</li>
                                ))}
                              </ul>
                              <p className="text-xs text-red-600 mt-2">Intervention may be required</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                {/* Status Buttons - Large Touch Targets */}
                {canEdit && !student.isDropped ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                      size="lg"
                      className="border-2 w-full h-12"
                      style={
                        studentAttendance?.status === 'present'
                          ? { backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white' }
                          : { borderColor: '#22c55e', color: '#22c55e' }
                      }
                      onClick={() => updateStatus(student.id, 'present')}
                      aria-label={`Mark ${student.name} as present`}
                      aria-pressed={studentAttendance?.status === 'present'}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                      Present
                    </Button>
                    <Button
                      variant={studentAttendance?.status === 'absent' ? 'default' : 'outline'}
                      size="lg"
                      className="border-2 w-full h-12"
                      style={
                        studentAttendance?.status === 'absent'
                          ? { backgroundColor: '#dc2626', borderColor: '#dc2626', color: 'white' }
                          : { borderColor: '#dc2626', color: '#dc2626' }
                      }
                      onClick={() => updateStatus(student.id, 'absent')}
                      aria-label={`Mark ${student.name} as absent`}
                      aria-pressed={studentAttendance?.status === 'absent'}
                    >
                      <XCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                      Absent
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm p-3 border-2" style={{ borderColor: '#E8F4F8' }}>
                    <strong>Status:</strong>{' '}
                    <span
                      style={{
                        color:
                          studentAttendance?.status === 'present'
                            ? '#22c55e'
                            : studentAttendance?.status === 'absent'
                            ? '#dc2626'
                            : '#0066A1',
                      }}
                    >
                      {studentAttendance?.status?.toUpperCase()}
                    </span>
                    {!canEdit && ' (Read-Only)'}
                    {student.isDropped && ' (Student Dropped)'}
                  </div>
                )}
              </div>
            );
          })}</div>
        <div className="bg-gray-50 border-t-2 px-4 py-3" style={{ borderTopColor: '#E8F4F8' }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total Records: {students.length}
              {showDroppedStudents && allStudents.filter((s) => s.isDropped).length > 0 && (
                <span className="ml-2 text-xs">
                  (including {allStudents.filter((s) => s.isDropped).length} dropped)
                </span>
              )}
            </span>
            {hasUnsavedChanges && (
              <span className="text-sm" style={{ color: '#F26522' }}>
                Unsaved changes - Click Save button above
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Print-only roster */}
      <div className="hidden print:block">
        <div className="border-2 p-4 mt-8" style={{ borderColor: '#003B5C' }}>
          <h3 className="text-lg mb-4" style={{ color: '#003B5C' }}>
            Class Roster - {classData.name}
          </h3>
          <p className="text-sm mb-2">
            <strong>CRN:</strong> {classData.crn} | <strong>Instructor:</strong> {classData.teacherName}
          </p>
          <p className="text-sm mb-4">
            <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '2px solid #003B5C' }}>
                <th className="text-left p-2">Student Name</th>
                <th className="text-left p-2">Student ID</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.studentId}</td>
                  <td className="p-2">{attendance[student.id]?.status?.toUpperCase() || 'PRESENT'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}