import { User, Class, Student, AttendanceRecord, SubstituteAssignment, AuditLog, Term } from '../types';

// Current academic year is 2024-2025 (August 2024 - July 2025)
export const mockTerms: Term[] = [
  {
    code: 'F24',
    name: 'Fall 2024',
    startDate: '2024-08-15',
    endDate: '2024-12-20',
    academicYear: '2024-2025',
  },
  {
    code: 'W25',
    name: 'Winter 2025',
    startDate: '2025-01-06',
    endDate: '2025-03-15',
    academicYear: '2024-2025',
  },
  {
    code: 'SP25',
    name: 'Spring 2025',
    startDate: '2025-03-20',
    endDate: '2025-06-10',
    academicYear: '2024-2025',
  },
  {
    code: 'SU25',
    name: 'Summer 2025',
    startDate: '2025-06-15',
    endDate: '2025-07-31',
    academicYear: '2024-2025',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@noce.edu',
    role: 'teacher',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@noce.edu',
    role: 'guest-teacher',
  },
  {
    id: '3',
    name: 'Linda Martinez',
    email: 'linda.martinez@noce.edu',
    role: 'admin-it',
  },
  {
    id: '4',
    name: 'Robert Davis',
    email: 'robert.davis@noce.edu',
    role: 'teacher',
  },
  {
    id: '5',
    name: 'Emily White',
    email: 'emily.white@noce.edu',
    role: 'teacher',
  },
  {
    id: '6',
    name: 'James Brown',
    email: 'james.brown@noce.edu',
    role: 'departmental',
    department: 'Mathematics',
  },
];

export const mockClasses: Class[] = [
  {
    id: 'c1',
    name: 'Mathematics 101',
    grade: '9th Grade',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    studentCount: 24,
    crn: 'CRN10101',
    term: 'Fall 2024',
    termCode: 'F24',
    department: 'Mathematics',
    creditHours: 3,
    startDate: '2024-08-15',
    endDate: '2024-12-20',
  },
  {
    id: 'c2',
    name: 'English Literature',
    grade: '10th Grade',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    studentCount: 22,
    crn: 'CRN10205',
    term: 'Fall 2024',
    termCode: 'F24',
    department: 'English',
    creditHours: 3,
    startDate: '2024-08-15',
    endDate: '2024-12-20',
  },
  {
    id: 'c3',
    name: 'Biology Lab',
    grade: '11th Grade',
    teacherId: '2',
    teacherName: 'Mike Chen',
    studentCount: 20,
    crn: 'CRN11345',
    term: 'Fall 2024',
    termCode: 'F24',
    department: 'Science',
    creditHours: 4,
    startDate: '2024-08-15',
    endDate: '2024-12-20',
  },
  {
    id: 'c4',
    name: 'World History',
    grade: '9th Grade',
    teacherId: '4',
    teacherName: 'Robert Davis',
    studentCount: 26,
    crn: 'CRN10450',
    term: 'Fall 2024',
    termCode: 'F24',
    department: 'History',
    creditHours: 3,
    startDate: '2024-08-15',
    endDate: '2024-12-20',
  },
  {
    id: 'c5',
    name: 'Chemistry',
    grade: '12th Grade',
    teacherId: '5',
    teacherName: 'Emily White',
    studentCount: 18,
    crn: 'CRN12550',
    term: 'Fall 2024',
    termCode: 'F24',
    department: 'Science',
    creditHours: 4,
    startDate: '2024-08-15',
    endDate: '2024-12-20',
  },
  {
    id: 'c6',
    name: 'Algebra II',
    grade: '10th Grade',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    studentCount: 20,
    crn: 'CRN10102',
    term: 'Winter 2025',
    termCode: 'W25',
    department: 'Mathematics',
    creditHours: 3,
    startDate: '2025-01-06',
    endDate: '2025-03-15',
  },
];

// Substitute assignments - guest teachers assigned to specific classes/CRNs
export const mockSubstituteAssignments: SubstituteAssignment[] = [
  {
    id: 'sub1',
    classId: 'c1',
    crn: 'CRN10101',
    substituteId: '2',
    substituteName: 'Mike Chen',
    startDate: '2024-12-01',
    endDate: '2024-12-10',
    isActive: true,
  },
];

export const mockStudents: Record<string, Student[]> = {
  c1: [
    { id: 's1', name: 'Alex Anderson', studentId: 'STU001' },
    { id: 's2', name: 'Beth Brown', studentId: 'STU002' },
    { id: 's3', name: 'Charlie Clark', studentId: 'STU003' },
    { id: 's4', name: 'Diana Davis', studentId: 'STU004' },
    { id: 's5', name: 'Ethan Evans', studentId: 'STU005' },
    { id: 's6', name: 'Fiona Foster', studentId: 'STU006' },
    { id: 's7', name: 'George Gray', studentId: 'STU007', isDropped: true, droppedDate: '2024-11-15' },
    { id: 's8', name: 'Hannah Harris', studentId: 'STU008' },
    { id: 's9', name: 'Isaac Inez', studentId: 'STU009' },
    { id: 's10', name: 'Julia Jackson', studentId: 'STU010' },
  ],
  c2: [
    { id: 's11', name: 'Kevin King', studentId: 'STU011' },
    { id: 's12', name: 'Laura Lee', studentId: 'STU012' },
    { id: 's13', name: 'Marcus Miller', studentId: 'STU013' },
    { id: 's14', name: 'Nina Nelson', studentId: 'STU014', isDropped: true, droppedDate: '2024-10-20' },
    { id: 's15', name: 'Oliver Owen', studentId: 'STU015' },
    { id: 's16', name: 'Paula Price', studentId: 'STU016' },
    { id: 's17', name: 'Quinn Rogers', studentId: 'STU017' },
    { id: 's18', name: 'Rachel Ross', studentId: 'STU018' },
  ],
  c3: [
    { id: 's19', name: 'Samuel Smith', studentId: 'STU019' },
    { id: 's20', name: 'Tara Taylor', studentId: 'STU020' },
    { id: 's21', name: 'Uma Turner', studentId: 'STU021' },
    { id: 's22', name: 'Victor Vance', studentId: 'STU022' },
    { id: 's23', name: 'Wendy Walker', studentId: 'STU023' },
    { id: 's24', name: 'Xavier Young', studentId: 'STU024' },
  ],
  c4: [
    { id: 's25', name: 'Yara Zimmerman', studentId: 'STU025' },
    { id: 's26', name: 'Zoe Adams', studentId: 'STU026' },
    { id: 's27', name: 'Aaron Baker', studentId: 'STU027' },
    { id: 's28', name: 'Bella Carter', studentId: 'STU028' },
  ],
  c5: [
    { id: 's29', name: 'Carl Dixon', studentId: 'STU029' },
    { id: 's30', name: 'Daisy Ellis', studentId: 'STU030' },
  ],
  c6: [
    { id: 's31', name: 'Evan Fisher', studentId: 'STU031' },
    { id: 's32', name: 'Grace Harper', studentId: 'STU032' },
  ],
};

// Helper function to generate attendance records with CRN and markedByRole
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  let recordId = 1;
  
  // Generate last 30 days of attendance (to show more patterns)
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date('2024-12-05'); // Current date for demo
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  // CLASS C1 - Mathematics 101
  const c1Students = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'];
  
  c1Students.forEach((studentId) => {
    dates.forEach((date) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let notes = '';
      const isSubDate = date >= '2024-12-01' && date <= '2024-12-10';
      
      // s2 (Beth Brown) - 3 CONSECUTIVE absences recently
      if (studentId === 's2' && (date === '2024-12-05' || date === '2024-12-04' || date === '2024-12-03')) {
        status = 'absent';
        notes = 'Absent - No contact';
      }
      
      // s5 (Ethan Evans) - 3 consecutive absences
      if (studentId === 's5' && (date === '2024-12-02' || date === '2024-12-01' || date === '2024-11-30')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      // s8 (Hannah Harris) - 3 consecutive absences
      if (studentId === 's8' && (date === '2024-11-28' || date === '2024-11-27' || date === '2024-11-26')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      // s3 (Charlie Clark) - occasionally late
      if (studentId === 's3' && date === '2024-12-05') {
        status = 'late';
        notes = 'Arrived 15 minutes late';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c1',
        crn: 'CRN10101',
        date,
        status,
        notes,
        markedBy: isSubDate ? 'Mike Chen' : 'Sarah Johnson',
        markedByRole: isSubDate ? 'substitute' : 'instructor',
        markedAt: `${date}T08:30:00`,
      });
    });
  });
  
  // CLASS C2 - English Literature
  const c2Students = ['s11', 's12', 's13', 's14', 's15', 's16', 's17', 's18'];
  c2Students.forEach((studentId) => {
    dates.forEach((date) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let notes = '';
      
      // s12 (Laura Lee) - 3 consecutive absences
      if (studentId === 's12' && (date === '2024-12-05' || date === '2024-12-04' || date === '2024-12-03')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      // s15 (Oliver Owen) - 3 consecutive absences
      if (studentId === 's15' && (date === '2024-11-20' || date === '2024-11-19' || date === '2024-11-18')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c2',
        crn: 'CRN10205',
        date,
        status,
        notes,
        markedBy: 'Sarah Johnson',
        markedByRole: 'instructor',
        markedAt: `${date}T08:30:00`,
      });
    });
  });
  
  // CLASS C3 - Biology Lab
  const c3Students = ['s19', 's20', 's21', 's22', 's23', 's24'];
  c3Students.forEach((studentId) => {
    dates.forEach((date) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let notes = '';
      
      // s20 (Tara Taylor) - 3 consecutive absences
      if (studentId === 's20' && (date === '2024-12-05' || date === '2024-12-04' || date === '2024-12-03')) {
        status = 'absent';
        notes = 'Absent - Family emergency';
      }
      
      // s23 (Wendy Walker) - 3 consecutive absences
      if (studentId === 's23' && (date === '2024-11-25' || date === '2024-11-24' || date === '2024-11-23')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c3',
        crn: 'CRN11345',
        date,
        status,
        notes,
        markedBy: 'Mike Chen',
        markedByRole: 'instructor',
        markedAt: `${date}T08:30:00`,
      });
    });
  });
  
  // CLASS C4 - World History
  const c4Students = ['s25', 's26', 's27', 's28'];
  c4Students.forEach((studentId) => {
    dates.forEach((date) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let notes = '';
      
      // s26 (Zoe Adams) - 3 consecutive absences
      if (studentId === 's26' && (date === '2024-12-05' || date === '2024-12-04' || date === '2024-12-03')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c4',
        crn: 'CRN10450',
        date,
        status,
        notes,
        markedBy: 'Robert Davis',
        markedByRole: 'instructor',
        markedAt: `${date}T08:30:00`,
      });
    });
  });
  
  // CLASS C5 - Chemistry
  const c5Students = ['s29', 's30'];
  c5Students.forEach((studentId) => {
    dates.forEach((date) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let notes = '';
      
      // s30 (Daisy Ellis) - 3 consecutive absences
      if (studentId === 's30' && (date === '2024-11-22' || date === '2024-11-21' || date === '2024-11-20')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c5',
        crn: 'CRN12550',
        date,
        status,
        notes,
        markedBy: 'Emily White',
        markedByRole: 'instructor',
        markedAt: `${date}T08:30:00`,
      });
    });
  });
  
  return records;
};

export const mockAttendanceRecords: AttendanceRecord[] = generateAttendanceRecords();

// Mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log1',
    userId: '1',
    userName: 'Sarah Johnson',
    action: 'Updated attendance',
    entityType: 'attendance',
    entityId: 'a1',
    changes: 'Changed status from present to absent for student STU001',
    timestamp: '2024-12-05T10:30:00',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log2',
    userId: '2',
    userName: 'Mike Chen',
    action: 'Marked attendance',
    entityType: 'attendance',
    entityId: 'a150',
    changes: 'Marked attendance for CRN10101 on 2024-12-01 as substitute',
    timestamp: '2024-12-01T08:35:00',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'log3',
    userId: '3',
    userName: 'Linda Martinez',
    action: 'Exported report',
    entityType: 'attendance',
    entityId: 'all',
    changes: 'Exported CSV attendance report for Fall 2024',
    timestamp: '2024-12-04T15:20:00',
    ipAddress: '192.168.1.102',
  },
];

// Helper function to get consecutive absences for a student
export const getConsecutiveAbsences = (studentId: string, classId: string, upToDate: string): { count: number; dates: string[] } => {
  const relevantRecords = mockAttendanceRecords
    .filter((r) => r.studentId === studentId && r.classId === classId && r.date <= upToDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let consecutiveCount = 0;
  const consecutiveDates: string[] = [];
  
  for (const record of relevantRecords) {
    if (record.status === 'absent') {
      consecutiveCount++;
      consecutiveDates.push(record.date);
    } else {
      break; // Stop at first non-absent
    }
  }
  
  return {
    count: consecutiveCount,
    dates: consecutiveDates.reverse(),
  };
};

// Helper function to get at-risk students (3+ consecutive absences)
export const getAtRiskStudents = () => {
  const studentAbsences: Record<string, { count: number; studentId: string; classId: string; dates: string[] }> = {};
  
  // Group by student-class combination
  const studentClasses = new Set<string>();
  mockAttendanceRecords.forEach((record) => {
    studentClasses.add(`${record.studentId}-${record.classId}`);
  });
  
  studentClasses.forEach((key) => {
    const [studentId, classId] = key.split('-');
    const today = new Date('2024-12-05').toISOString().split('T')[0];
    const consecutive = getConsecutiveAbsences(studentId, classId, today);
    
    if (consecutive.count >= 3) {
      studentAbsences[key] = {
        count: consecutive.count,
        studentId,
        classId,
        dates: consecutive.dates,
      };
    }
  });
  
  return Object.values(studentAbsences);
};

// Get at-risk count by class
export const getAtRiskCountByClass = (classId: string): number => {
  const atRisk = getAtRiskStudents();
  return atRisk.filter((s) => s.classId === classId).length;
};

// Helper to check if user can access a class
export const canUserAccessClass = (user: User, classData: Class): boolean => {
  if (user.role === 'admin-it') return true;
  if (user.role === 'departmental') {
    return classData.department === user.department;
  }
  if (user.role === 'teacher') {
    return classData.teacherId === user.id;
  }
  if (user.role === 'guest-teacher') {
    // Check if there's an active substitute assignment
    const hasAssignment = mockSubstituteAssignments.some(
      (sub) => sub.classId === classData.id && sub.substituteId === user.id && sub.isActive
    );
    return hasAssignment;
  }
  return false;
};

// Get classes missing attendance for a specific date
export const getClassesMissingAttendance = (date: string, termCode?: string): Class[] => {
  return mockClasses.filter((classData) => {
    if (termCode && classData.termCode !== termCode) return false;
    
    const students = mockStudents[classData.id] || [];
    const classRecords = mockAttendanceRecords.filter(
      (r) => r.classId === classData.id && r.date === date
    );
    
    return classRecords.length < students.length;
  });
};

// Calculate attendance completion percentage by CRN
export const getAttendanceCompletionByCRN = (crn: string, startDate: string, endDate: string): number => {
  const classData = mockClasses.find((c) => c.crn === crn);
  if (!classData) return 0;
  
  const students = mockStudents[classData.id] || [];
  const totalStudents = students.filter((s) => !s.isDropped).length;
  
  // Calculate expected records
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const expectedRecords = totalStudents * daysDiff;
  
  // Calculate actual records
  const actualRecords = mockAttendanceRecords.filter(
    (r) => r.crn === crn && r.date >= startDate && r.date <= endDate
  ).length;
  
  return expectedRecords > 0 ? (actualRecords / expectedRecords) * 100 : 0;
};
