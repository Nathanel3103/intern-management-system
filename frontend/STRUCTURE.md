# Frontend Structure Documentation

## Overview
This frontend has been reorganized with a clean separation of concerns:
- **Pages**: Individual page components
- **Components**: Reusable UI components
- **Services**: API communication layer
- **Contexts**: Global state management

## Folder Structure
```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── LoginForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/             # Page components
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
```

## Key Components

### 1. API Service (`services/api.js`)
- Centralized API communication
- Automatic token handling
- Error handling and token refresh
- Role-based API endpoints

### 2. Auth Context (`contexts/AuthContext.jsx`)
- Global authentication state
- User role management
- Login/logout functionality
- Token persistence

### 3. Login Form (`components/LoginForm.jsx`)
- Reusable login component
- Role-specific styling
- Error handling
- Loading states

### 4. Protected Route (`components/ProtectedRoute.jsx`)
- Route protection based on roles
- Automatic redirects
- Loading states

## Usage Examples

### Login with Auth Context
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { login, user, isAuthenticated } = useAuth();
  
  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    if (result.success) {
      // Redirect based on user role
    }
  };
}
```

### Protected Route
```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/admin" 
  element={
    <ProtectedRoute roles={['ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### API Calls
```jsx
import { authAPI, userAPI } from './services/api';

// Login
const response = await authAPI.login(username, password);

// Get users
const users = await userAPI.getAllUsers();
```

## Backend Integration

### Endpoints
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login (JWT)
- `GET /api/users/user/` - Current user details

### Role Management
- **ADMIN**: Full access
- **SUPERVISOR**: Manager access
- **INTERN**: Basic access

## Security Features
- JWT token authentication
- Automatic token refresh
- Role-based access control
- Protected routes
- Error handling
