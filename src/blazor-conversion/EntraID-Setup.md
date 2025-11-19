# Microsoft EntraID (Azure AD) Setup Guide

## Overview
This guide walks you through configuring Microsoft EntraID authentication for ITendance v2.0.

## Prerequisites
- Azure subscription with admin access
- NOCE organizational account
- Visual Studio 2022 with Azure development workload

## Step 1: Register Application in Azure Portal

### 1.1 Access Azure Portal
1. Navigate to https://portal.azure.com
2. Sign in with your organizational account
3. Search for "App registrations" in the top search bar

### 1.2 Create New App Registration
1. Click **+ New registration**
2. Fill in the details:
   - **Name**: `ITendance v2.0 - NOCE Attendance System`
   - **Supported account types**: `Accounts in this organizational directory only (NOCE only - Single tenant)`
   - **Redirect URI**: 
     - Platform: `Web`
     - URI: `https://localhost:5001/signin-oidc` (for development)
     - Add production URI later: `https://attendance.noce.edu/signin-oidc`
3. Click **Register**

### 1.3 Note Important Values
After registration, copy these values (you'll need them for `appsettings.json`):
- **Application (client) ID**: e.g., `12345678-1234-1234-1234-123456789012`
- **Directory (tenant) ID**: e.g., `abcdefgh-abcd-abcd-abcd-abcdefghijkl`

## Step 2: Configure Authentication Settings

### 2.1 Add Redirect URIs
1. In your app registration, go to **Authentication**
2. Under **Redirect URIs**, add:
   - `https://localhost:5001/signin-oidc`
   - `https://localhost:5001/signout-callback-oidc`
   - Production URLs (when ready):
     - `https://attendance.noce.edu/signin-oidc`
     - `https://attendance.noce.edu/signout-callback-oidc`

### 2.2 Configure Logout URLs
1. Under **Front-channel logout URL**: `https://localhost:5001/signout-oidc`
2. Under **Implicit grant and hybrid flows**:
   - ✅ Check **ID tokens** (for sign-in flows)

### 2.3 Save Changes
Click **Save** at the bottom

## Step 3: Create Client Secret

### 3.1 Generate Secret
1. Go to **Certificates & secrets**
2. Click **+ New client secret**
3. Enter description: `NOCE Attendance Production Secret`
4. Select expiration: `24 months` (recommended)
5. Click **Add**

### 3.2 Copy Secret Value
**IMPORTANT**: Copy the secret **Value** immediately (not the Secret ID). You cannot view it again!
- Example: `abc123~defGHI456.jklMNO789_pqrSTU012`

## Step 4: Configure API Permissions

### 4.1 Add Microsoft Graph Permissions
1. Go to **API permissions**
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `User.Read` (already added by default)
   - `User.ReadBasic.All` (to read other users' basic info)
   - `Directory.Read.All` (to read directory data)
6. Click **Add permissions**

### 4.2 Grant Admin Consent
1. Click **Grant admin consent for [Your Organization]**
2. Confirm by clicking **Yes**
3. Wait for status to show green checkmarks

## Step 5: Configure App Roles (for Role-Based Access)

### 5.1 Create App Roles
1. Go to **App roles**
2. Click **+ Create app role**

**Create Role 1: Teacher**
- Display name: `Teacher`
- Allowed member types: `Users/Groups`
- Value: `Teacher`
- Description: `Regular faculty members who can mark attendance for their assigned classes`
- Enable this app role: ✅ Checked

**Create Role 2: Guest Teacher**
- Display name: `Guest Teacher`
- Allowed member types: `Users/Groups`
- Value: `GuestTeacher`
- Description: `Substitute teachers who can mark attendance for temporarily assigned classes`
- Enable this app role: ✅ Checked

**Create Role 3: Admin IT**
- Display name: `Admin IT`
- Allowed member types: `Users/Groups`
- Value: `AdminIT`
- Description: `IT administrators who can access all classes and run reports`
- Enable this app role: ✅ Checked

## Step 6: Assign Users to Roles

### 6.1 Assign Via Enterprise Applications
1. Go to **Azure Active Directory** → **Enterprise applications**
2. Find your app: `ITendance v2.0 - NOCE Attendance System`
3. Go to **Users and groups**
4. Click **+ Add user/group**
5. Select users and assign appropriate roles:
   - Select **Users**: Choose user(s)
   - Select **Role**: Choose Teacher, GuestTeacher, or AdminIT
6. Click **Assign**

### 6.2 Bulk Assignment (Optional)
For bulk user assignment, use Azure AD Groups:
1. Create security groups: `NOCE-Teachers`, `NOCE-GuestTeachers`, `NOCE-AdminIT`
2. Add users to appropriate groups
3. Assign groups to app roles (same process as above, but select groups instead of users)

## Step 7: Update appsettings.json

Update your `appsettings.json` with the values from Steps 1-3:

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "noce.edu",
    "TenantId": "YOUR_TENANT_ID_FROM_STEP_1.3",
    "ClientId": "YOUR_CLIENT_ID_FROM_STEP_1.3",
    "ClientSecret": "YOUR_CLIENT_SECRET_FROM_STEP_3.2",
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath": "/signout-callback-oidc"
  }
}
```

**⚠️ SECURITY WARNING**: 
- Never commit `ClientSecret` to source control
- Use Azure Key Vault or User Secrets in production
- For development, use .NET User Secrets:
  ```bash
  dotnet user-secrets set "AzureAd:ClientSecret" "YOUR_SECRET_HERE"
  ```

## Step 8: Configure User Secrets (Development)

### 8.1 Initialize User Secrets
```bash
cd NOCEAttendance.BlazorApp
dotnet user-secrets init
```

### 8.2 Set Secrets
```bash
dotnet user-secrets set "AzureAd:TenantId" "YOUR_TENANT_ID"
dotnet user-secrets set "AzureAd:ClientId" "YOUR_CLIENT_ID"
dotnet user-secrets set "AzureAd:ClientSecret" "YOUR_CLIENT_SECRET"
```

### 8.3 Verify Secrets
```bash
dotnet user-secrets list
```

## Step 9: Production Deployment - Azure Key Vault

### 9.1 Create Key Vault
1. In Azure Portal, create a new Key Vault
2. Name: `noce-attendance-keyvault`
3. Region: Same as your app

### 9.2 Add Secrets
1. Go to **Secrets** → **+ Generate/Import**
2. Add these secrets:
   - Name: `AzureAd--TenantId`, Value: [Your Tenant ID]
   - Name: `AzureAd--ClientId`, Value: [Your Client ID]
   - Name: `AzureAd--ClientSecret`, Value: [Your Client Secret]

### 9.3 Configure Managed Identity
1. In your App Service, go to **Identity**
2. Enable **System assigned** managed identity
3. Go to Key Vault → **Access policies**
4. Add access policy for your App Service's managed identity
5. Grant **Get** and **List** permissions for secrets

### 9.4 Update Program.cs
```csharp
// Add Key Vault configuration
if (builder.Environment.IsProduction())
{
    var keyVaultEndpoint = new Uri(builder.Configuration["KeyVaultEndpoint"]!);
    builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());
}
```

## Step 10: Test Authentication

### 10.1 Run Application
```bash
dotnet run
```

### 10.2 Test Sign-In
1. Navigate to `https://localhost:5001`
2. You should be redirected to Microsoft login
3. Sign in with NOCE credentials
4. After authentication, you should be redirected back to the app

### 10.3 Verify Role Claims
Add this to a Razor page to test:
```razor
<AuthorizeView Roles="Teacher,GuestTeacher,AdminIT">
    <Authorized>
        <p>Your role: @context.User.FindFirst(c => c.Type == "roles")?.Value</p>
    </Authorized>
    <NotAuthorized>
        <p>No role assigned. Please contact IT admin.</p>
    </NotAuthorized>
</AuthorizeView>
```

## Troubleshooting

### Issue: "AADSTS50011: The redirect URI specified in the request does not match"
**Solution**: Ensure the redirect URI in your app exactly matches what's configured in Azure Portal (including trailing slashes).

### Issue: "AADSTS700016: Application not found in the directory"
**Solution**: Verify the `TenantId` and `ClientId` in your `appsettings.json` are correct.

### Issue: Users don't have roles
**Solution**: 
1. Verify roles are created in App registrations → App roles
2. Verify users are assigned to roles in Enterprise applications → Users and groups
3. Have user sign out and sign in again to refresh token

### Issue: "Invalid client secret"
**Solution**: 
1. The secret may have expired - generate a new one
2. Ensure you copied the **Value** not the **Secret ID**
3. Check for extra spaces when pasting the secret

## Next Steps

1. **Configure Claims Transformation**: Map Azure AD roles to application roles
2. **Add Custom User Properties**: Store additional user data in local database
3. **Implement Audit Logging**: Track authentication events
4. **Setup MFA**: Require multi-factor authentication for admin roles
5. **Configure Conditional Access**: Restrict access based on location, device, etc.

## Security Best Practices

✅ **DO**:
- Use Azure Key Vault for production secrets
- Enable MFA for all users, especially admins
- Regularly rotate client secrets (set calendar reminder)
- Use managed identities when possible
- Implement least-privilege access
- Enable Azure AD audit logging

❌ **DON'T**:
- Commit secrets to source control
- Share client secrets via email or chat
- Use overly broad permissions
- Disable HTTPS in production
- Allow password-based authentication for service accounts

## Support Resources

- **Microsoft Identity Platform Docs**: https://learn.microsoft.com/entra/identity-platform/
- **Azure AD App Registration**: https://learn.microsoft.com/entra/identity-platform/quickstart-register-app
- **Microsoft.Identity.Web Library**: https://learn.microsoft.com/entra/msal/dotnet/microsoft-identity-web/
- **NOCE IT Support**: support@noce.edu