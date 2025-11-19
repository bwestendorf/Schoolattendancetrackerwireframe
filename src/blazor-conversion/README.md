# ITendance v2.0 - Blazor + MudBlazor Conversion Guide

## Overview
This guide will help you convert the React-based NOCE Attendance System to ITendance v2.0, a Blazor application using MudBlazor components while maintaining the traditional .NET enterprise design aesthetic.

## Prerequisites

### Required Software
- **Visual Studio 2022** (Community, Professional, or Enterprise)
- **.NET 8.0 SDK** or later
- **SQL Server** (Express or higher) for production database

### Required NuGet Packages
```xml
<PackageReference Include="MudBlazor" Version="6.11.2" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.OpenIdConnect" Version="8.0.0" />
<PackageReference Include="Microsoft.Identity.Web" Version="2.15.0" />
<PackageReference Include="Microsoft.Identity.Web.UI" Version="2.15.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
```

## Project Structure

```
ITendance.BlazorApp/
├── Program.cs                          # Application entry point & configuration
├── appsettings.json                    # Configuration including EntraID
├── Pages/
│   ├── _Layout.cshtml                  # Main layout HTML
│   ├── Index.razor                     # Dashboard
│   ├── ClassAttendance.razor           # Attendance marking page
│   ├── AdminReports.razor              # Reports page
│   └── Login.razor                     # Login page (if needed)
├── Shared/
│   ├── MainLayout.razor                # Main application layout
│   ├── NavMenu.razor                   # Navigation menu
│   ├── CalendarWidget.razor            # Calendar sidebar widget
│   └── SidebarPanel.razor              # Reusable sidebar component
├── Data/
│   ├── ApplicationDbContext.cs         # EF Core database context
│   ├── Models/
│   │   ├── Class.cs
│   │   ├── Student.cs
│   │   ├── AttendanceRecord.cs
│   │   └── User.cs
│   └── Services/
│       ├── AttendanceService.cs
│       └── UserService.cs
├── Themes/
│   └── NOCETheme.cs                    # Custom MudBlazor theme
└── wwwroot/
    └── css/
        └── custom.css                  # Additional custom styles
```

## Step-by-Step Conversion

### Step 1: Create New Blazor Project

**Using Visual Studio:**
1. File → New → Project
2. Select "Blazor Web App" template
3. Name: `ITendance.BlazorApp`
4. Framework: .NET 8.0
5. Authentication Type: Microsoft Identity Platform
6. Configure for HTTPS

**Using .NET CLI:**
```bash
dotnet new blazor -n ITendance.BlazorApp -au IndividualB2C
cd ITendance.BlazorApp
dotnet add package MudBlazor
```

### Step 2: Install MudBlazor

Add to `Program.cs`:
```csharp
using MudBlazor.Services;

// After var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMudServices();
```

Add to `_Layout.cshtml` (in `<head>`):
```html
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
<link href="_content/MudBlazor/MudBlazor.min.css" rel="stylesheet" />
```

Add to `_Layout.cshtml` (before `</body>`):
```html
<script src="_content/MudBlazor/MudBlazor.min.js"></script>
```

### Step 3: Configure EntraID Authentication

See `EntraID-Setup.md` for detailed configuration.

### Step 4: Create Custom Theme

See `NOCETheme.cs` for NOCE-branded MudBlazor theme configuration.

### Step 5: Build Components

See individual `.razor` files for complete component implementations.

## Key Differences: React vs Blazor

| React | Blazor |
|-------|--------|
| `useState()` | `@code { private string _value; }` |
| `useEffect()` | `OnInitializedAsync()` / `OnParametersSetAsync()` |
| `props` | `[Parameter]` attributes |
| `.tsx` files | `.razor` files |
| JavaScript/TypeScript | C# |
| npm packages | NuGet packages |
| Tailwind CSS | MudBlazor components + custom CSS |

## MudBlazor Component Mapping

| Current React | MudBlazor Equivalent |
|---------------|---------------------|
| `<Button>` | `<MudButton>` |
| `<Select>` | `<MudSelect>` |
| `<Table>` | `<MudTable>` or `<MudDataGrid>` |
| `<Dialog>` | `<MudDialog>` |
| `<Alert>` | `<MudAlert>` |
| `<Badge>` | `<MudBadge>` or `<MudChip>` |
| `<Calendar>` | Custom component (see CalendarWidget.razor) |
| `<Breadcrumb>` | `<MudBreadcrumbs>` |

## Deployment to IIS

1. **Publish the application:**
   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. **Configure IIS:**
   - Install .NET 8.0 Hosting Bundle
   - Create new website in IIS
   - Point to publish folder
   - Set application pool to "No Managed Code"

3. **Configure web.config** (auto-generated, but verify):
   ```xml
   <aspNetCore processPath="dotnet" 
               arguments=".\ITendance.BlazorApp.dll" 
               stdoutLogEnabled="false" 
               stdoutLogFile=".\logs\stdout" 
               hostingModel="inprocess" />
   ```

## Database Setup

1. **Update connection string** in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=ITendance;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
   }
   ```

2. **Run migrations:**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

## Next Steps

1. Review `NOCETheme.cs` for brand colors configuration
2. Review `MainLayout.razor` for iTendance-style layout
3. Implement `EntraID-Setup.md` for authentication
4. Review individual component files for implementation details
5. Test locally with `dotnet run`
6. Deploy to IIS following deployment guide

## Support Resources

- **MudBlazor Documentation:** https://mudblazor.com/
- **Blazor Documentation:** https://learn.microsoft.com/aspnet/core/blazor/
- **Microsoft Identity Platform:** https://learn.microsoft.com/entra/identity-platform/