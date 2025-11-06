using MudBlazor;

namespace NOCEAttendance.BlazorApp.Themes
{
    /// <summary>
    /// Custom MudBlazor theme for NOCE Attendance System
    /// Implements NOCE brand colors (Navy, Orange, Light Blue) with traditional .NET/iTendance styling
    /// </summary>
    public static class NOCETheme
    {
        public static MudTheme Theme { get; } = new MudTheme()
        {
            // NOCE Brand Colors
            Palette = new PaletteLight()
            {
                // Primary - Navy Blue
                Primary = "#003B5C",
                PrimaryContrastText = "#FFFFFF",
                PrimaryDarken = "#002840",
                PrimaryLighten = "#0066A1",

                // Secondary - Light Blue
                Secondary = "#E8F4F8",
                SecondaryContrastText = "#003B5C",
                SecondaryDarken = "#D0E8F0",
                SecondaryLighten = "#F5F9FB",

                // Accent - Orange
                Tertiary = "#F26522",
                TertiaryContrastText = "#FFFFFF",
                TertiaryDarken = "#D94F0F",
                TertiaryLighten = "#FF8547",

                // Backgrounds
                Background = "#F5F5F5",
                BackgroundGrey = "#E8F4F8",
                Surface = "#FFFFFF",
                AppbarBackground = "#003B5C",
                AppbarText = "#FFFFFF",
                DrawerBackground = "#FFFFFF",
                DrawerText = "#1A1A1A",

                // Text
                TextPrimary = "#1A1A1A",
                TextSecondary = "#6B7280",
                TextDisabled = "#9CA3AF",

                // Alerts
                Error = "#DC2626",
                ErrorContrastText = "#FFFFFF",
                Warning = "#F59E0B",
                WarningContrastText = "#FFFFFF",
                Info = "#0066A1",
                InfoContrastText = "#FFFFFF",
                Success = "#22C55E",
                SuccessContrastText = "#FFFFFF",

                // Dividers and Borders
                Divider = "#E8F4F8",
                DividerLight = "#F5F9FB",
                Lines = "#E5E7EB",
                LinesDefault = "#E5E7EB",
                LinesInputs = "#E8F4F8",

                // Table specific
                TableLines = "#E8F4F8",
                TableStriped = "#F9FAFB",
                TableHover = "#F3F4F6",

                // Action colors
                ActionDefault = "#003B5C",
                ActionDisabled = "#9CA3AF",
                ActionDisabledBackground = "#F3F4F6",

                // Dark mode overlay (for hover effects)
                DarkContrastText = "#FFFFFF",
                OverlayLight = "rgba(255,255,255,0.4)",
                OverlayDark = "rgba(0,0,0,0.5)",
            },

            // Typography - Traditional .NET styling (not overly modern)
            Typography = new Typography()
            {
                Default = new Default()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "0.875rem",
                    FontWeight = 400,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                H1 = new H1()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "1.5rem",
                    FontWeight = 600,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                H2 = new H2()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "1.25rem",
                    FontWeight = 600,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                H3 = new H3()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "1.125rem",
                    FontWeight = 600,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                H4 = new H4()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "1rem",
                    FontWeight = 600,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                H5 = new H5()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "0.875rem",
                    FontWeight = 600,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                H6 = new H6()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "0.75rem",
                    FontWeight = 600,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                Button = new Button()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "0.875rem",
                    FontWeight = 500,
                    LineHeight = 1.5,
                    LetterSpacing = "normal",
                    TextTransform = "none" // Don't uppercase buttons
                },
                Body1 = new Body1()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "0.875rem",
                    FontWeight = 400,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                Body2 = new Body2()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "0.75rem",
                    FontWeight = 400,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                },
                Caption = new Caption()
                {
                    FontFamily = new[] { "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif" },
                    FontSize = "0.75rem",
                    FontWeight = 400,
                    LineHeight = 1.5,
                    LetterSpacing = "normal"
                }
            },

            // Shadows - Minimal for traditional .NET look
            Shadows = new Shadow()
            {
                Elevation = new string[]
                {
                    "none",
                    "0 2px 4px rgba(0,0,0,.08)",
                    "0 3px 6px rgba(0,0,0,.12)",
                    "0 4px 8px rgba(0,0,0,.16)",
                    "0 6px 12px rgba(0,0,0,.20)",
                    "0 8px 16px rgba(0,0,0,.24)"
                }
            },

            // Border radius - Square/minimal for traditional look
            LayoutProperties = new LayoutProperties()
            {
                DefaultBorderRadius = "0px", // Square corners for traditional .NET look
                DrawerWidthLeft = "240px",
                DrawerWidthRight = "240px",
                AppbarHeight = "64px"
            },

            // Z-Index configuration
            ZIndex = new ZIndex()
            {
                Drawer = 1100,
                AppBar = 1200,
                Dialog = 1300,
                Popover = 1400,
                Snackbar = 1500,
                Tooltip = 1600
            }
        };

        /// <summary>
        /// Helper method to get NOCE brand colors directly
        /// </summary>
        public static class Colors
        {
            public const string Navy = "#003B5C";
            public const string Blue = "#0066A1";
            public const string Orange = "#F26522";
            public const string LightBlue = "#E8F4F8";
            public const string Gold = "#FDB913";
            public const string White = "#FFFFFF";
            public const string DarkGrey = "#1A1A1A";
            public const string MediumGrey = "#6B7280";
            public const string LightGrey = "#F5F5F5";
        }
    }
}
