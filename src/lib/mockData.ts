import { User, Class, Student, AttendanceRecord } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    role: 'teacher',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@school.edu',
    role: 'guest-teacher',
  },
  {
    id: '3',
    name: 'Linda Martinez',
    email: 'linda.martinez@school.edu',
    role: 'admin-it',
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
  },
  {
    id: 'c2',
    name: 'English Literature',
    grade: '10th Grade',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    studentCount: 22,
  },
  {
    id: 'c3',
    name: 'Biology Lab',
    grade: '11th Grade',
    teacherId: '2',
    teacherName: 'Mike Chen',
    studentCount: 20,
  },
  {
    id: 'c4',
    name: 'World History',
    grade: '9th Grade',
    teacherId: '4',
    teacherName: 'Robert Davis',
    studentCount: 26,
  },
  {
    id: 'c5',
    name: 'Chemistry',
    grade: '12th Grade',
    teacherId: '5',
    teacherName: 'Emily White',
    studentCount: 18,
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
    { id: 's7', name: 'George Gray', studentId: 'STU007' },
    { id: 's8', name: 'Hannah Harris', studentId: 'STU008' },
    { id: 's9', name: 'Isaac Inez', studentId: 'STU009' },
    { id: 's10', name: 'Julia Jackson', studentId: 'STU010' },
  ],
  c2: [
    { id: 's11', name: 'Kevin King', studentId: 'STU011' },
    { id: 's12', name: 'Laura Lee', studentId: 'STU012' },
    { id: 's13', name: 'Marcus Miller', studentId: 'STU013' },
    { id: 's14', name: 'Nina Nelson', studentId: 'STU014' },
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
};

// Helper function to generate attendance records
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  let recordId = 1;
  
  // Generate last 10 days of attendance
  const dates = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date('2025-10-21');
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  // CLASS C1 - Mathematics 101
  const c1Students = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'];
  
  c1Students.forEach((studentId) => {
    dates.forEach((date) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let notes = '';
      
      // s2 (Beth Brown) - CRITICAL: 5 absences in last 10 days
      if (studentId === 's2' && (date === '2025-10-21' || date === '2025-10-20' || date === '2025-10-17' || date === '2025-10-16' || date === '2025-10-14')) {
        status = 'absent';
        notes = 'Absent - No contact';
      }
      
      // s5 (Ethan Evans) - 4 consecutive absences
      if (studentId === 's5' && (date === '2025-10-21' || date === '2025-10-20' || date === '2025-10-19' || date === '2025-10-18')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      // s8 (Hannah Harris) - 3 absences
      if (studentId === 's8' && (date === '2025-10-18' || date === '2025-10-15' || date === '2025-10-13')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      // s3 (Charlie Clark) - occasionally late but mostly present
      if (studentId === 's3' && date === '2025-10-21') {
        status = 'late';
        notes = 'Arrived 15 minutes late';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c1',
        date,
        status,
        notes,
        markedBy: 'Sarah Johnson',
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
      
      // s12 (Laura Lee) - 4 absences in last 10 days
      if (studentId === 's12' && (date === '2025-10-21' || date === '2025-10-19' || date === '2025-10-16' || date === '2025-10-14')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      // s15 (Oliver Owen) - 3 absences
      if (studentId === 's15' && (date === '2025-10-20' || date === '2025-10-17' || date === '2025-10-13')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c2',
        date,
        status,
        notes,
        markedBy: 'Sarah Johnson',
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
      
      // s20 (Tara Taylor) - 5 absences - CRITICAL
      if (studentId === 's20' && (date === '2025-10-21' || date === '2025-10-20' || date === '2025-10-18' || date === '2025-10-16' || date === '2025-10-13')) {
        status = 'absent';
        notes = 'Absent - Family emergency';
      }
      
      // s23 (Wendy Walker) - 3 absences
      if (studentId === 's23' && (date === '2025-10-19' || date === '2025-10-15' || date === '2025-10-12')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c3',
        date,
        status,
        notes,
        markedBy: 'Mike Chen',
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
      
      // s26 (Zoe Adams) - 4 absences
      if (studentId === 's26' && (date === '2025-10-21' || date === '2025-10-18' || date === '2025-10-15' || date === '2025-10-12')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c4',
        date,
        status,
        notes,
        markedBy: 'Robert Davis',
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
      
      // s30 (Daisy Ellis) - 3 absences
      if (studentId === 's30' && (date === '2025-10-20' || date === '2025-10-17' || date === '2025-10-14')) {
        status = 'absent';
        notes = 'Absent';
      }
      
      records.push({
        id: `a${recordId++}`,
        studentId,
        classId: 'c5',
        date,
        status,
        notes,
        markedBy: 'Emily White',
        markedAt: `${date}T08:30:00`,
      });
    });
  });
  
  return records;
};

export const mockAttendanceRecords: AttendanceRecord[] = generateAttendanceRecords();

// Helper function to get at-risk students (3+ absences in last 10 days)
export const getAtRiskStudents = () => {
  const studentAbsences: Record<string, { count: number; studentId: string; classId: string; dates: string[] }> = {};
  
  mockAttendanceRecords.forEach((record) => {
    if (record.status === 'absent') {
      const key = `${record.studentId}-${record.classId}`;
      if (!studentAbsences[key]) {
        studentAbsences[key] = {
          count: 0,
          studentId: record.studentId,
          classId: record.classId,
          dates: [],
        };
      }
      studentAbsences[key].count++;
      studentAbsences[key].dates.push(record.date);
    }
  });
  
  // Filter for students with 3+ absences
  return Object.values(studentAbsences).filter((s) => s.count >= 3);
};

// Get at-risk count by class
export const getAtRiskCountByClass = (classId: string): number => {
  const atRisk = getAtRiskStudents();
  return atRisk.filter((s) => s.classId === classId).length;
};