import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { User, AttendanceRecord } from '../types';
import { mockClasses, mockStudents, mockAttendanceRecords } from '../lib/mockData';
import { ArrowLeft, Calendar, Save, CheckCircle, XCircle, Clock, FileCheck, AlertTriangle, Home, BookOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

interface ClassAttendanceProps {
  user: User;
  classId: string;
  onBack: () => void;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface StudentAttendance {
  studentId: string;
  status: AttendanceStatus;
  notes: string;
}

export function ClassAttendance({ user, classId, onBack }: ClassAttendanceProps) {
  const classData = mockClasses.find((c) => c.id === classId);
  const students = mockStudents[classId] || [];
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, StudentAttendance>>({});
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load existing attendance for the selected date
    const dateAttendance: Record<string, StudentAttendance> = {};
    students.forEach((student) => {
      const record = mockAttendanceRecords.find(
        (r) => r.studentId === student.id && r.classId === classId && r.date === selectedDate
      );
      dateAttendance[student.id] = {
        studentId: student.id,
        status: record?.status || 'present',
        notes: record?.notes || '',
      };
    });
    setAttendance(dateAttendance);
    setHasUnsavedChanges(false);
  }, [selectedDate, classId, students]);

  const updateAttendance = (studentId: string, status: AttendanceStatus, notes?: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
        notes: notes !== undefined ? notes : prev[studentId]?.notes || '',
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving attendance:', attendance);
    setHasUnsavedChanges(false);
    // Show success message
    alert('Attendance saved successfully!');
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'excused':
        return <FileCheck className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadgeVariant = (status: AttendanceStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'present':
        return 'default';
      case 'absent':
        return 'destructive';
      case 'late':
        return 'secondary';
      case 'excused':
        return 'outline';
    }
  };

  // Calculate recent absence count for each student (last 10 days)
  const getRecentAbsences = (studentId: string): { count: number; dates: string[] } => {
    const today = new Date(selectedDate);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const recentRecords = mockAttendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        record.studentId === studentId &&
        record.classId === classId &&
        recordDate >= tenDaysAgo &&
        recordDate <= today &&
        record.status === 'absent'
      );
    });
    
    return {
      count: recentRecords.length,
      dates: recentRecords.map((r) => r.date).sort(),
    };
  };

  const stats = {
    present: Object.values(attendance).filter((a) => a.status === 'present').length,
    absent: Object.values(attendance).filter((a) => a.status === 'absent').length,
    late: Object.values(attendance).filter((a) => a.status === 'late').length,
    excused: Object.values(attendance).filter((a) => a.status === 'excused').length,
  };

  if (!classData) {
    return <div>Class not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="flex items-center gap-1" onClick={onBack}>
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

      <Separator />

      {/* Header - Traditional .NET Style */}
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 pl-4 flex-1" style={{ borderLeftColor: '#003B5C' }}>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="border-2"
              style={{ borderColor: '#003B5C', color: '#003B5C' }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Classes
            </Button>
          </div>
          <h2 style={{ color: '#003B5C' }}>{classData.name}</h2>
          <p className="text-muted-foreground">{classData.grade} • Instructor: {classData.teacherName}</p>
        </div>
        {hasUnsavedChanges && (
          <Button 
            onClick={handleSave} 
            className="border-2"
            style={{ backgroundColor: '#F26522', color: 'white', borderColor: '#F26522' }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Attendance Changes
          </Button>
        )}
      </div>

      {/* Date Selector and Stats - Traditional Panel Style */}
      <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>Attendance Summary for {new Date(selectedDate).toLocaleDateString()}</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Date Selector */}
            <div className="border-2 p-4 bg-gray-50" style={{ borderColor: '#E8F4F8' }}>
              <label className="text-xs text-muted-foreground block mb-2">Select Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: '#003B5C' }} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 px-2 py-1 border-2 text-sm"
                  style={{ borderColor: '#E8F4F8' }}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#22c55e', borderLeftWidth: '4px' }}>
              <label className="text-xs text-muted-foreground block">Present</label>
              <p className="text-2xl" style={{ color: '#22c55e' }}>{stats.present}</p>
            </div>

            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#dc2626', borderLeftWidth: '4px' }}>
              <label className="text-xs text-muted-foreground block">Absent</label>
              <p className="text-2xl" style={{ color: '#dc2626' }}>{stats.absent}</p>
            </div>

            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#F26522', borderLeftWidth: '4px' }}>
              <label className="text-xs text-muted-foreground block">Late</label>
              <p className="text-2xl" style={{ color: '#F26522' }}>{stats.late}</p>
            </div>

            <div className="border-2 p-4 text-center" style={{ borderColor: '#E8F4F8', borderLeftColor: '#0066A1', borderLeftWidth: '4px' }}>
              <label className="text-xs text-muted-foreground block">Excused</label>
              <p className="text-2xl" style={{ color: '#0066A1' }}>{stats.excused}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table - GridView Style */}
      <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>Student Attendance Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2" style={{ borderBottomColor: '#003B5C' }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Student ID</th>
                <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Student Name</th>
                <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Status</th>
                <th className="px-4 py-3 text-left text-xs border-r" style={{ color: '#003B5C' }}>Notes</th>
                <th className="px-4 py-3 text-right text-xs" style={{ color: '#003B5C' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const studentAttendance = attendance[student.id];
                const recentAbsences = getRecentAbsences(student.id);
                const hasMultipleAbsences = recentAbsences.count >= 3;
                
                return (
                  <tr 
                    key={student.id} 
                    className={`border-b ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} ${hasMultipleAbsences ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-4 py-3 border-r text-sm">{student.studentId}</td>
                    <td className="px-4 py-3 border-r">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{student.name}</span>
                        {hasMultipleAbsences && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 border-2 border-red-600 px-2 py-1">
                                  <AlertTriangle className="h-3 w-3 text-red-600" />
                                  <span className="text-xs text-red-600">{recentAbsences.count} Absences</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <p>Recent absences (last 10 days):</p>
                                  <ul className="text-sm space-y-0.5">
                                    {recentAbsences.dates.map((date) => (
                                      <li key={date}>• {new Date(date).toLocaleDateString()}</li>
                                    ))}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(studentAttendance?.status || 'present')}
                        <span className="text-sm">{studentAttendance?.status || 'present'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r">
                      <span className="text-sm text-muted-foreground">
                        {studentAttendance?.notes || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2"
                        style={{ borderColor: '#003B5C', color: '#003B5C' }}
                        onClick={() => setEditingStudent(student.id)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 border-t-2 px-4 py-3 text-sm text-muted-foreground" style={{ borderTopColor: '#E8F4F8' }}>
          Total Records: {students.length}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingStudent !== null} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="border-2" style={{ borderColor: '#003B5C' }}>
          <DialogHeader className="border-b-2 pb-4" style={{ borderBottomColor: '#E8F4F8' }}>
            <DialogTitle style={{ color: '#003B5C' }}>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update attendance status for {students.find((s) => s.id === editingStudent)?.name}
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Attendance Status *</Label>
                <Select
                  value={attendance[editingStudent]?.status || 'present'}
                  onValueChange={(value) => updateAttendance(editingStudent, value as AttendanceStatus)}
                >
                  <SelectTrigger className="border-2" style={{ borderColor: '#E8F4F8' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={attendance[editingStudent]?.notes || ''}
                  onChange={(e) =>
                    updateAttendance(
                      editingStudent,
                      attendance[editingStudent]?.status || 'present',
                      e.target.value
                    )
                  }
                  placeholder="Enter any additional notes or comments..."
                  rows={3}
                  className="border-2"
                  style={{ borderColor: '#E8F4F8' }}
                />
              </div>
            </div>
          )}
          <DialogFooter className="border-t-2 pt-4" style={{ borderTopColor: '#E8F4F8' }}>
            <Button 
              variant="outline" 
              onClick={() => setEditingStudent(null)}
              className="border-2"
              style={{ borderColor: '#003B5C', color: '#003B5C' }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}