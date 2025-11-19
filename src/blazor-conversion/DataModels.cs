using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITendance.BlazorApp.Data.Models
{
    /// <summary>
    /// Represents a class/course in the system
    /// </summary>
    public class Class
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string CourseCode { get; set; } = string.Empty;

        [StringLength(50)]
        public string GradeLevel { get; set; } = string.Empty;

        [StringLength(100)]
        public string Department { get; set; } = string.Empty;

        public int TeacherId { get; set; }

        [ForeignKey("TeacherId")]
        public virtual User Teacher { get; set; } = null!;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [StringLength(20)]
        public string Semester { get; set; } = string.Empty; // Fall, Spring, Summer

        public int Year { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
        public virtual ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
    }

    /// <summary>
    /// Represents a student in the system
    /// </summary>
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string StudentId { get; set; } = string.Empty; // External student ID (e.g., STU001)

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        [StringLength(50)]
        public string GradeLevel { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime EnrollmentDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
        public virtual ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
    }

    /// <summary>
    /// Junction table for many-to-many relationship between Students and Classes
    /// </summary>
    public class StudentClass
    {
        [Key]
        public int Id { get; set; }

        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; } = null!;

        public int ClassId { get; set; }

        [ForeignKey("ClassId")]
        public virtual Class Class { get; set; } = null!;

        public DateTime EnrolledDate { get; set; } = DateTime.UtcNow;
        public DateTime? DroppedDate { get; set; }
        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// Represents a single attendance record for a student in a class on a specific date
    /// </summary>
    public class AttendanceRecord
    {
        [Key]
        public int Id { get; set; }

        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; } = null!;

        public int ClassId { get; set; }

        [ForeignKey("ClassId")]
        public virtual Class Class { get; set; } = null!;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Present"; // Present, Absent, Late, Excused

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;

        public int RecordedById { get; set; }

        [ForeignKey("RecordedById")]
        public virtual User RecordedBy { get; set; } = null!;

        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Represents a user in the system (teacher, guest teacher, or admin)
    /// </summary>
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";

        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = string.Empty; // Teacher, GuestTeacher, AdminIT

        // Azure AD / EntraID information
        [StringLength(100)]
        public string EntraIdObjectId { get; set; } = string.Empty; // Maps to Azure AD user

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public virtual ICollection<Class> Classes { get; set; } = new List<Class>();
        public virtual ICollection<AttendanceRecord> AttendanceRecordsCreated { get; set; } = new List<AttendanceRecord>();
    }

    /// <summary>
    /// Audit log for tracking changes and actions in the system
    /// </summary>
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; } = string.Empty; // Login, AttendanceMarked, ReportGenerated, etc.

        [StringLength(100)]
        public string EntityType { get; set; } = string.Empty; // Class, Student, AttendanceRecord, etc.

        public int? EntityId { get; set; }

        [StringLength(1000)]
        public string Details { get; set; } = string.Empty;

        [StringLength(50)]
        public string IpAddress { get; set; } = string.Empty;

        [StringLength(500)]
        public string UserAgent { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Enum for attendance status (can also use database lookup table)
    /// </summary>
    public enum AttendanceStatus
    {
        Present,
        Absent,
        Late,
        Excused
    }

    /// <summary>
    /// Enum for user roles
    /// </summary>
    public enum UserRole
    {
        Teacher,
        GuestTeacher,
        AdminIT
    }
}