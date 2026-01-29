# Mock Users Configuration

This document describes the mock users available for testing the role-based routing system.

## Available Mock Users

### 1. Super Admin User

- **Email**: `superadmin@municipal.gov`
- **Password**: `admin123!@#`
- **Name**: Alex Morgan
- **Role**: SUPER_ADMIN
- **Access**: Super Admin Portal with jurisdiction selection

### 2. Municipality Admin User

- **Email**: `admin@springfield.gov`
- **Password**: `admin123!@#`
- **Name**: John Smith
- **Role**: MUNICIPALITY_ADMIN
- **Municipality**: Springfield
- **Access**: Regular home dashboard with full menu

### 3. Manager User

- **Email**: `manager@municipal.gov`
- **Password**: `manager123!@#`
- **Name**: Sarah Johnson
- **Role**: MANAGER
- **Access**: Regular home dashboard with full menu

## How It Works

### Login Flow

1. User enters credentials on the login page
2. The system checks if the user is a mock user first (in `MockUsersService`)
3. If it's a mock user, authentication is immediate (no API call)
4. If not a mock user, the system proceeds with the real API authentication
5. User role is stored in localStorage along with the token

### Role-Based Routing

- **Super Admin** → Redirected to `/super-admin-portal`
- **Municipality Admin / Manager** → Redirected to `/home`

### Guards Applied

- `authGuard`: Checks if user is authenticated
- `superAdminGuard`: Only allows SUPER_ADMIN role to access super admin portal
- `municipalityGuard`: Only allows MUNICIPALITY_ADMIN and MANAGER roles to access home

## Testing the System

### Test Super Admin Flow

1. Login with `superadmin@municipal.gov` / `admin123!@#`
2. You should be redirected to the Super Admin Portal
3. Select a municipality from the dropdown
4. Click "Enter Dashboard" to access the regular home interface
5. You can also click "Create New Municipality" or "Global System Configurations"

### Test Municipality Admin Flow

1. Login with `admin@springfield.gov` / `admin123!@#`
2. You should be redirected to the regular Home dashboard
3. You'll have access to all menu items and features

### Test Manager Flow

1. Login with `manager@municipal.gov` / `manager123!@#`
2. You should be redirected to the regular Home dashboard
3. You'll have access to all menu items and features

## File Structure

```
src/app/
├── core/
│   ├── models/
│   │   └── user-role.model.ts          # UserRole enum and AuthUser interface
│   ├── services/
│   │   ├── mock-users.service.ts       # Mock users management
│   │   └── token-repository.service.ts # Enhanced with role storage
│   └── guards/
│       ├── auth.guard.ts               # Authentication guard
│       └── role.guard.ts               # Role-based guards
├── features/
│   ├── login/
│   │   └── store/
│   │       └── login.effects.ts        # Updated to check mock users
│   └── super-admin-portal/
│       ├── super-admin-portal.component.ts
│       ├── super-admin-portal.component.html
│       └── super-admin-portal.component.scss
└── routes/
    └── app.routes.ts                   # Updated with role guards
```

## Customization

### Adding More Mock Users

Edit `src/app/core/services/mock-users.service.ts` and add entries to the `mockUsers` object:

```typescript
'newuser@example.com': {
  email: 'newuser@example.com',
  password: 'password123',
  name: 'New User',
  role: UserRole.MUNICIPALITY_ADMIN,
  token: 'mock-token-xxxxx',
  municipalityId: 'municipality-id', // optional
},
```

### Modifying Roles

The roles are defined in `src/app/core/models/user-role.model.ts`:

- `SUPER_ADMIN`: Full system access, can impersonate municipalities
- `MUNICIPALITY_ADMIN`: Municipality-level administration
- `MANAGER`: Municipality-level management

## Important Notes

1. Mock users bypass API authentication for quick testing
2. Real API users will still work normally if they're not in the mock users list
3. User roles are stored in localStorage and cleared on logout
4. The token expiration time is set to 5 minutes (configurable in `TokenRepositoryService`)
