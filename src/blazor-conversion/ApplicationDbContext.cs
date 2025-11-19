using Microsoft.EntityFrameworkCore;
using ITendance.BlazorApp.Data.Models;

namespace ITendance.BlazorApp.Data
{
    /// <summary>
    /// Database context for the NOCE Attendance application
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Student> Students { get; set; } = null!;
        public DbSet<Class> Classes { get; set; } = null!;
        public DbSet<StudentClass> StudentClasses { get; set; } = null!;
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.EntraIdObjectId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Configure Student entity
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasIndex(e => e.StudentId).IsUnique();
                entity.HasIndex(e => e.Email);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Configure Class entity
            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasIndex(e => e.CourseCode);
                entity.HasIndex(e => e.TeacherId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Configure relationship with Teacher (User)
                entity.HasOne(c => c.Teacher)
                    .WithMany(u => u.Classes)
                    .HasForeignKey(c => c.TeacherId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure StudentClass junction table
            modelBuilder.Entity<StudentClass>(entity =>
            {
                // Composite index for unique student-class combination
                entity.HasIndex(e => new { e.StudentId, e.ClassId }).IsUnique();

                entity.HasOne(sc => sc.Student)
                    .WithMany(s => s.StudentClasses)
                    .HasForeignKey(sc => sc.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(sc => sc.Class)
                    .WithMany(c => c.StudentClasses)
                    .HasForeignKey(sc => sc.ClassId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure AttendanceRecord entity
            modelBuilder.Entity<AttendanceRecord>(entity =>
            {
                // Composite index for unique attendance per student per class per date
                entity.HasIndex(e => new { e.StudentId, e.ClassId, e.Date }).IsUnique();
                
                entity.HasIndex(e => e.Date);
                entity.HasIndex(e => e.Status);
                entity.Property(e => e.RecordedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(ar => ar.Student)
                    .WithMany(s => s.AttendanceRecords)
                    .HasForeignKey(ar => ar.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ar => ar.Class)
                    .WithMany(c => c.AttendanceRecords)
                    .HasForeignKey(ar => ar.ClassId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(ar => ar.RecordedBy)
                    .WithMany(u => u.AttendanceRecordsCreated)
                    .HasForeignKey(ar => ar.RecordedById)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure AuditLog entity
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasIndex(e => e.Action);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => new { e.EntityType, e.EntityId });
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(al => al.User)
                    .WithMany()
                    .HasForeignKey(al => al.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Seed initial data (optional)
            SeedData(modelBuilder);
        }

        /// <summary>
        /// Seed initial data for development/testing
        /// </summary>
        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Users (Teachers and Admins)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "sarah.johnson@noce.edu",
                    FirstName = "Sarah",
                    LastName = "Johnson",
                    Phone = "714-555-0101",
                    Role = "Teacher",
                    EntraIdObjectId = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Email = "michael.chen@noce.edu",
                    FirstName = "Michael",
                    LastName = "Chen",
                    Phone = "714-555-0102",
                    Role = "GuestTeacher",
                    EntraIdObjectId = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 3,
                    Email = "admin@noce.edu",
                    FirstName = "System",
                    LastName = "Administrator",
                    Phone = "714-555-0100",
                    Role = "AdminIT",
                    EntraIdObjectId = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed Classes
            modelBuilder.Entity<Class>().HasData(
                new Class
                {
                    Id = 1,
                    Name = "Mathematics 101",
                    CourseCode = "MATH101",
                    GradeLevel = "10th Grade",
                    Department = "Mathematics",
                    TeacherId = 1,
                    StartDate = new DateTime(2024, 9, 1),
                    EndDate = new DateTime(2025, 6, 15),
                    Semester = "Fall 2024",
                    Year = 2024,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Class
                {
                    Id = 2,
                    Name = "English Literature",
                    CourseCode = "ENG201",
                    GradeLevel = "11th Grade",
                    Department = "English",
                    TeacherId = 1,
                    StartDate = new DateTime(2024, 9, 1),
                    EndDate = new DateTime(2025, 6, 15),
                    Semester = "Fall 2024",
                    Year = 2024,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed Students
            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    Id = 1,
                    StudentId = "STU001",
                    FirstName = "Alex",
                    LastName = "Anderson",
                    Email = "alex.anderson@student.noce.edu",
                    Phone = "714-555-1001",
                    DateOfBirth = new DateTime(2007, 3, 15),
                    GradeLevel = "10th Grade",
                    IsActive = true,
                    EnrollmentDate = new DateTime(2024, 9, 1),
                    CreatedAt = DateTime.UtcNow
                },
                new Student
                {
                    Id = 2,
                    StudentId = "STU002",
                    FirstName = "Beth",
                    LastName = "Brown",
                    Email = "beth.brown@student.noce.edu",
                    Phone = "714-555-1002",
                    DateOfBirth = new DateTime(2007, 5, 22),
                    GradeLevel = "10th Grade",
                    IsActive = true,
                    EnrollmentDate = new DateTime(2024, 9, 1),
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed StudentClass relationships
            modelBuilder.Entity<StudentClass>().HasData(
                new StudentClass { Id = 1, StudentId = 1, ClassId = 1, EnrolledDate = new DateTime(2024, 9, 1), IsActive = true },
                new StudentClass { Id = 2, StudentId = 2, ClassId = 1, EnrolledDate = new DateTime(2024, 9, 1), IsActive = true },
                new StudentClass { Id = 3, StudentId = 1, ClassId = 2, EnrolledDate = new DateTime(2024, 9, 1), IsActive = true }
            );
        }

        /// <summary>
        /// Override SaveChanges to automatically update UpdatedAt timestamps
        /// </summary>
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        /// <summary>
        /// Override SaveChangesAsync to automatically update UpdatedAt timestamps
        /// </summary>
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        /// <summary>
        /// Automatically set UpdatedAt for modified entities
        /// </summary>
        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                if (entry.Entity.GetType().GetProperty("UpdatedAt") != null)
                {
                    entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
                }
            }
        }
    }
}