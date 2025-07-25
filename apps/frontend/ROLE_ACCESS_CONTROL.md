# Role-Based Access Control (RBAC) System

This document explains the role-based access control system implemented in the betting application.

## Overview

The RBAC system ensures that users can only access features and data appropriate to their role in the hierarchy. The system prevents users from seeing or managing users of higher or equal hierarchy levels.

## Hierarchy Order

The user hierarchy from highest to lowest authority:

1. **SUPER_ADMIN** - Highest authority, can manage all users
2. **ADMIN** - Can manage SUB_OWNER and below
3. **SUB_OWNER** - Can manage SUB and below
4. **SUB** - Can manage MASTER and below
5. **MASTER** - Can manage SUPER_AGENT and below
6. **SUPER_AGENT** - Can manage AGENT and below
7. **AGENT** - Can manage USER (clients) and below
8. **USER** - End users/clients, no management permissions

## Key Features

### 1. Role-Based Navigation
- Sidebar navigation automatically filters based on user's role
- Users only see menu items they have permission to access
- Login Reports are only visible to SUB_OWNER and above

### 2. API Protection
- All user-related APIs respect hierarchy boundaries
- Users cannot access data of higher or equal hierarchy levels
- Automatic filtering of user lists based on role permissions

### 3. Feature Access Control
- Specific features are restricted based on role requirements
- Login Reports: SUB_OWNER, ADMIN, SUPER_ADMIN only
- Super Admin management: SUPER_ADMIN only
- Admin management: ADMIN, SUPER_ADMIN only

## API Endpoints

### 1. Role Access Information
```
GET /api/auth/role-access
```
Returns the current user's role-based access information including:
- Accessible roles
- Navigation menu items
- Feature access permissions
- Accessible users by role

### 2. Filtered Users
```
GET /api/users/filtered?role=USER&parentId=123&includeInactive=true
```
Returns users filtered by the current user's role hierarchy:
- Only shows users the current user can manage
- Includes hierarchy information
- Respects role-based access restrictions

## Usage Examples

### 1. Using the Role Access Hook

```typescript
import { useRoleAccess } from '../lib/hooks/useRoleAccess';

function MyComponent() {
  const { user, canAccess, canManageRole, loading, error } = useRoleAccess();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Check if user can access a specific feature
  if (!canAccess('login_reports')) {
    return <div>Access denied</div>;
  }

  // Check if user can manage a specific role
  if (canManageRole('AGENT')) {
    // Show agent management options
  }

  return <div>Welcome, {user?.name}</div>;
}
```

### 2. Using Feature Access Hook

```typescript
import { useFeatureAccess } from '../lib/hooks/useRoleAccess';

function LoginReportsComponent() {
  const { hasAccess, user, loading } = useFeatureAccess('login_reports');

  if (loading) return <div>Loading...</div>;
  if (!hasAccess) return <div>Access denied</div>;

  return <div>Login Reports for {user?.role}</div>;
}
```

### 3. Using Route Protection Hook

```typescript
import { useRouteProtection } from '../lib/hooks/useRoleAccess';

function ProtectedPage() {
  const { user, loading, hasAccess } = useRouteProtection('login_reports');

  if (loading) return <div>Loading...</div>;
  if (!hasAccess) return <div>Access denied</div>;

  return <div>Protected content for {user?.role}</div>;
}
```

### 4. API Middleware Protection

```typescript
import { withRoleAuth } from '../lib/middleware/roleAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Your API logic here
}

// Protect with role-based middleware
export default withRoleAuth(handler, {
  requiredFeature: 'login_reports',
  requiredRole: 'SUB_OWNER'
});
```

## Navigation Structure

The sidebar navigation is automatically generated based on user role:

### SUPER_ADMIN
- All navigation sections visible
- Can access all user management pages
- Can access all ledger pages
- Can access all cash transaction pages
- Can access login reports

### ADMIN
- Cannot see Super Admin management
- Can access Admin and below management
- Can access login reports

### SUB_OWNER
- Cannot see Super Admin or Admin management
- Can access Sub Owner and below management
- Can access login reports

### SUB
- Cannot see Super Admin, Admin, or Sub Owner management
- Can access Sub and below management
- Cannot access login reports

### MASTER
- Cannot see higher level management
- Can access Master and below management
- Cannot access login reports

### SUPER_AGENT
- Cannot see higher level management
- Can access Super Agent and below management
- Cannot access login reports

### AGENT
- Cannot see higher level management
- Can access Agent and below management
- Cannot access login reports

### USER
- No management permissions
- Can only access their own ledger

## Security Features

### 1. Session Validation
- All role-based APIs validate user sessions
- Automatic redirect to login for invalid sessions

### 2. Role Hierarchy Enforcement
- Users cannot access data of equal or higher hierarchy levels
- API responses are filtered based on user's role
- Frontend components respect role boundaries

### 3. Feature-Level Protection
- Specific features require explicit role permissions
- Login Reports are restricted to SUB_OWNER and above
- Management features are restricted by hierarchy

## Error Handling

### 1. Access Denied (403)
- Returned when user tries to access unauthorized resources
- Includes descriptive error messages
- Automatic redirection to appropriate pages

### 2. Session Invalid (401)
- Returned when user session is invalid or expired
- Automatic redirect to login page
- Clear error messages for debugging

### 3. Server Error (500)
- Returned for unexpected server errors
- Includes error details for debugging
- Graceful fallback handling

## Best Practices

### 1. Always Check Permissions
```typescript
// Good: Check permissions before rendering
if (!canAccess('feature_name')) {
  return <AccessDenied />;
}

// Bad: Assume permissions
return <FeatureComponent />;
```

### 2. Use Appropriate Hooks
```typescript
// For general role access
const { user, canAccess } = useRoleAccess();

// For specific feature access
const { hasAccess } = useFeatureAccess('feature_name');

// For route protection
const { hasAccess } = useRouteProtection('feature_name');
```

### 3. Handle Loading States
```typescript
if (loading) {
  return <LoadingSpinner />;
}
```

### 4. Provide Clear Error Messages
```typescript
if (error) {
  return <ErrorMessage message={error} />;
}
```

## Testing

### 1. Test Different Roles
- Test each role to ensure proper access restrictions
- Verify that higher roles cannot access lower role data
- Confirm that lower roles cannot access higher role data

### 2. Test Feature Access
- Verify that login reports are only accessible to SUB_OWNER+
- Test that management features respect hierarchy
- Confirm that navigation filters correctly

### 3. Test API Protection
- Test API endpoints with different user roles
- Verify that filtered APIs return appropriate data
- Confirm that unauthorized access returns 403 errors

## Troubleshooting

### 1. Navigation Not Filtering
- Check that user role is correctly set in session
- Verify that `getRoleBasedNavigation` is being called
- Ensure role hierarchy is correctly defined

### 2. API Access Denied
- Verify user session is valid
- Check that user role has required permissions
- Confirm that role hierarchy is correctly implemented

### 3. Feature Access Issues
- Check that feature is defined in `canAccessFeature`
- Verify that user role is in the allowed roles list
- Ensure feature access is being checked correctly

## Future Enhancements

### 1. Dynamic Permissions
- Database-driven permission system
- User-specific permission overrides
- Time-based permission restrictions

### 2. Audit Logging
- Log all access attempts
- Track permission changes
- Monitor role-based actions

### 3. Advanced Features
- Role inheritance
- Permission groups
- Conditional access rules 