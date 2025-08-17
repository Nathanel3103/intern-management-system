import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminUserManagement from '../components/AdminUserManagement';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showUserManagement, setShowUserManagement] = useState(false);

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'ADMIN':
        return (
          <div className="bg-gradient-to-br from-navy to-navy-dark rounded-2xl p-8 shadow-2xl border border-blue-200">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <p className="text-xl text-light-blue-100 mb-2">Welcome, {user.first_name} {user.last_name}!</p>
              <p className="text-light-blue-100 opacity-90">You have full system access.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-all">
                <div className="text-2xl font-bold text-white">256</div>
                <div className="text-light-blue-100">Total Users</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-all">
                <div className="text-2xl font-bold text-white">89</div>
                <div className="text-light-blue-100">Active Interns</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-all">
                <div className="text-2xl font-bold text-white">15</div>
                <div className="text-light-blue-100">Supervisors</div>
              </div>
            </div>
          </div>
        );
      case 'SUPERVISOR':
        return (
          <div className="bg-gradient-to-br from-light-blue to-blue-600 rounded-2xl p-8 shadow-2xl border border-blue-200">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <h1 className="text-4xl font-bold text-white">Supervisor Dashboard</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <p className="text-xl text-blue-50 mb-2">Welcome, {user.first_name} {user.last_name}!</p>
              <p className="text-blue-50 opacity-90">You can manage interns and reports.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-all">
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-blue-50">Assigned Interns</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/30 transition-all">
                <div className="text-2xl font-bold text-white">7</div>
                <div className="text-blue-50">Pending Reports</div>
              </div>
            </div>
          </div>
        );
      case 'INTERN':
        return (
          <div className="bg-gradient-to-br from-light-blue-100 to-blue-200 rounded-2xl p-8 shadow-2xl border border-blue-300">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <h1 className="text-4xl font-bold text-navy">Intern Dashboard</h1>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-6">
              <p className="text-xl text-navy mb-2">Welcome, {user.first_name} {user.last_name}!</p>
              <p className="text-navy opacity-80">You can view and submit reports.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/60 transition-all">
                <div className="text-2xl font-bold text-navy">5</div>
                <div className="text-navy opacity-80">Completed Reports</div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/60 transition-all">
                <div className="text-2xl font-bold text-navy">2</div>
                <div className="text-navy opacity-80">Pending Tasks</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-navy to-light-blue rounded-full mr-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">IS</span>
            </div>
            <h1 className="text-2xl font-bold text-navy">Intern System</h1>
          </div>
          <button 
            onClick={logout}
            className="bg-gradient-to-r from-navy to-navy-dark hover:from-navy-dark hover:to-navy text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </header>
        
        <main className="space-y-6">
          {getDashboardContent()}
          
          {user?.role === 'ADMIN' && showUserManagement && (
            <AdminUserManagement />
          )}
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-navy mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-gradient-to-r from-light-blue to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                View Reports
              </button>
              <button 
                onClick={() => setShowUserManagement(!showUserManagement)}
                className="bg-gradient-to-r from-navy to-navy-dark hover:from-navy-dark hover:to-navy text-white px-4 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {showUserManagement ? 'Close' : 'Create User'}
              </button>
              <button className="bg-gradient-to-r from-light-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-navy px-4 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Settings
              </button>
              <button className="bg-gradient-to-r from-white to-light-blue-50 hover:from-light-blue-50 hover:to-light-blue-100 text-navy border border-blue-200 px-4 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Help
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
