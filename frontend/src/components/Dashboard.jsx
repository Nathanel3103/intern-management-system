import React from 'react';
import { useAuth } from '../hooks/useAuth';
 

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.first_name} {user?.last_name}</h1>
        <button onClick={logout} className="logout-button">Logout</button>
      </header>
      
      <div className="dashboard-content">
        <div className="info-card">
          <h2>User Information</h2>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
        
        {user?.role === 'ADMIN' && (
          <div className="admin-section">
            <h2>Admin Controls</h2>
            <div className="admin-actions">
              <button className="action-button">Manage Users</button>
              <button className="action-button">View Reports</button>
            </div>
          </div>
        )}
        
        {user?.role === 'INTERN' && (
          <div className="intern-section">
            <h2>Your Dashboard</h2>
            <div className="intern-actions">
              <button className="action-button">View Tasks</button>
              <button className="action-button">Submit Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
