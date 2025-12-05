export type UserRole = 'teacher' | 'guest-teacher' | 'admin-it' | 'departmental';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string; // For departmental users
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  isDropped?: boolean;
  droppedDate?: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  crn: string; // Course Reference Number
  term: string; // e.g., "Fall 2024", "Spring 2025"
  termCode: string; // e.g., "F24", "S25"
  department: string;
  creditHours: number;
  startDate: string;
  endDate: string;
}

export interface SubstituteAssignment {
  id: string;
  classId: string;
  crn: string;
  substituteId: string;
  substituteName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  crn: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  markedByRole: 'instructor' | 'substitute'; // Distinguish between instructor of record and substitute
  markedAt: string;
}

export interface AttendanceStats {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'attendance' | 'class' | 'student' | 'user';
  entityId: string;
  changes: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Term {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  academicYear: string; // e.g., "2024-2025" (August to July)
}