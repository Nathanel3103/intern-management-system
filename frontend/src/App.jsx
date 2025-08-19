import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

// Import the DashboardPage component
import DashboardPage from './pages/DashboardPage';
import InternDashboard from './components/Interndashboard/InternDashboard.jsx';
const Unauthorized = () => <div>Unauthorized Access</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            {/* Admin Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            {/* Intern Dashboard */}
            <Route 
              path="/intern" 
              element={
                <ProtectedRoute roles={['INTERN']}>
                  <InternDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to login and authenticated users to role-based home */}
            <Route 
              path="/" 
              element={
                localStorage.getItem('token') ? (
                  // Decide based on stored user in localStorage if available, fallback to /dashboard
                  (() => {
                    try {
                      const userStr = localStorage.getItem('user');
                      const user = userStr ? JSON.parse(userStr) : null;
                      if (user?.role === 'INTERN') return <Navigate to="/intern" replace />;
                      return <Navigate to="/dashboard" replace />;
                    } catch {
                      return <Navigate to="/dashboard" replace />;
                    }
                  })()
                ) : 
                <Navigate to="/login" replace />
              } 
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
