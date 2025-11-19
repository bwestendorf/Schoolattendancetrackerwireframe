using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using MudBlazor.Services;
using ITendance.BlazorApp.Data;
using ITendance.BlazorApp.Data.Services;
using ITendance.BlazorApp.Themes;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

// 1. Add EntraID (Azure AD) Authentication
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));

// 2. Add authorization
builder.Services.AddAuthorization(options =>
{
    // Require authenticated users by default
    options.FallbackPolicy = options.DefaultPolicy;
    
    // Define role-based policies
    options.AddPolicy("TeacherOnly", policy => 
        policy.RequireRole("Teacher", "GuestTeacher"));
    
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole("AdminIT"));
    
    options.AddPolicy("AllRoles", policy => 
        policy.RequireRole("Teacher", "GuestTeacher", "AdminIT"));
});

// 3. Add Razor Pages and Controllers for Microsoft Identity
builder.Services.AddRazorPages()
    .AddMicrosoftIdentityUI();

// 4. Add Server-Side Blazor
builder.Services.AddServerSideBlazor()
    .AddMicrosoftIdentityConsentHandler();

// 5. Add MudBlazor services
builder.Services.AddMudServices(config =>
{
    // Configure MudBlazor defaults
    config.SnackbarConfiguration.PositionClass = MudBlazor.Defaults.Classes.Position.BottomRight;
    config.SnackbarConfiguration.PreventDuplicates = false;
    config.SnackbarConfiguration.NewestOnTop = false;
    config.SnackbarConfiguration.ShowCloseIcon = true;
    config.SnackbarConfiguration.VisibleStateDuration = 5000;
    config.SnackbarConfiguration.HideTransitionDuration = 500;
    config.SnackbarConfiguration.ShowTransitionDuration = 500;
});

// 6. Add Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));

// 7. Add Application Services
builder.Services.AddScoped<AttendanceService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ClassService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<ReportService>();

// 8. Add HTTP Context Accessor (for getting current user)
builder.Services.AddHttpContextAccessor();

// 9. Add Session (if needed for temporary data)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Authentication & Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Session middleware (if using)
app.UseSession();

app.MapControllers();
app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Apply migrations if needed
        if (app.Environment.IsDevelopment())
        {
            context.Database.Migrate();
        }
        
        // Seed initial data if needed
        // await DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database.");
    }
}

app.Run();