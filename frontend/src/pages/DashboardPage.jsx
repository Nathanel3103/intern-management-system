import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardStats from '../components/dashboard/DashboardStats';
import InternManagement from '../components/dashboard/InternManagement';
import TaskManagement from '../components/dashboard/TaskManagement';
import InternForm from '../components/dashboard/InternForm';
import TaskForm from '../components/dashboard/TaskForm';
import { internsAPI, tasksAPI } from '../services/api';
import { 
  FiUsers, FiFileText, FiPieChart, FiCheckCircle, 
  FiBell, FiLogOut, FiHome, FiUser, FiClipboard, FiFile 
} from 'react-icons/fi';
import { FaUserPlus, FaTasks, FaFileExport } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showInternForm, setShowInternForm] = useState(false);
  const [interns, setInterns] = useState([]);
  const [loadingInterns, setLoadingInterns] = useState(false);
  const [internsError, setInternsError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Implement User Authentication', 
      description: 'Create login and registration functionality with proper validation and security measures.',
      assignedTo: 'Sarah Chen', 
      dueDate: '2024-03-15', 
      priority: 'High', 
      status: 'In Progress', 
      progress: 65 
    },
    { 
      id: 2, 
      title: 'Design Mobile UI Components', 
      description: 'Create responsive UI components for mobile devices following design system guidelines.',
      assignedTo: 'Mike Johnson', 
      dueDate: '2024-03-10', 
      priority: 'Medium', 
      status: 'Completed', 
      progress: 100 
    }
  ]);

  // Mock data for the dashboard since its still in development
  const stats = [
    { title: 'Total interns', value: 24, change: '+3 this month', icon: <FiUsers className="text-blue-600 text-2xl" /> },
    { title: 'Active Tasks', value: 47, change: '12 due this week', icon: <FiFileText className="text-indigo-600 text-2xl" /> },
    { title: 'Reports Generated', value: 156, change: 'AI-powered summaries', icon: <FiPieChart className="text-purple-600 text-2xl" /> },
    { title: 'Completion Rate', value: '89%', change: '+5% from last month', icon: <FiCheckCircle className="text-green-600 text-2xl" /> }
  ];

  const activities = [
    { name: 'Sarah Cheneka', action: 'submitted weekly log', time: '2 minutes ago' },
    { name: 'New intern', action: 'Mike Nyahwai added', time: '1 hour ago' },
    { name: 'AI report', action: 'generated for Engineering Team', time: '3 hours ago' }
  ];

  // interns are managed in state above

  const quickActions = [
    { title: 'Add New Intern', icon: <FaUserPlus className="text-xl" />, action: 'interns' },
    { title: 'Create Task', icon: <FaTasks className="text-xl" />, action: 'tasks' },
    { title: 'Generate Report', icon: <FaFileExport className="text-xl" />, action: 'reports' }
  ];

  const handleActionClick = (section) => {
    setActiveSection(section);
    if (section === 'interns') {
      setShowInternForm(true);
    }
  };

  // Fetch interns from backend when Interns tab is opened (admin only)
  useEffect(() => {
    const fetchInterns = async () => {
      if (activeSection !== 'interns') return;
      setLoadingInterns(true);
      setInternsError('');
      try {
        const data = await internsAPI.list();
        setInterns(data || []);
      } catch (err) {
        console.error('Failed to load interns:', err);
        setInternsError('Failed to load interns');
      } finally {
        setLoadingInterns(false);
      }
    };
    fetchInterns();
  }, [activeSection]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (activeSection !== 'tasks') return;
      try {
        const data = await tasksAPI.list();
        if (Array.isArray(data) && data.length) {
          setTasks(data);
        }
      } catch (err) {
        // Keep existing demo tasks if backend not ready
      }
    };
    fetchTasks();
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">IT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Intern Management System
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="bg-white/20 text-blue-600 p-2 rounded-lg hover:bg-white/30 transition-colors">
              <FiBell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-600">{user?.role}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center gap-2"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="flex flex-wrap gap-2 md:gap-4 mb-8 bg-white rounded-xl shadow-lg p-4">
        <button 
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSection === 'dashboard' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setActiveSection('dashboard')}
        >
          <FiHome /> Dashboard
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSection === 'interns' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setActiveSection('interns')}
        >
          <FiUser /> Interns
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSection === 'tasks' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setActiveSection('tasks')}
        >
          <FiClipboard /> Tasks
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeSection === 'reports' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setActiveSection('reports')}
        >
          <FiFile /> Reports
        </button>
      </nav>
      
      {/* Main Content */}
      <main>
        {activeSection === 'dashboard' && (
          <DashboardStats 
            stats={stats}
            activities={activities}
            tasks={tasks}
            quickActions={quickActions}
            onActionClick={handleActionClick}
          />
        )}
        
        {activeSection === 'interns' && (
          <InternManagement 
            interns={interns}
            loading={loadingInterns}
            error={internsError}
            onAddNew={() => setShowInternForm(true)}
          />
        )}
        
        {activeSection === 'tasks' && (
          <TaskManagement 
            tasks={tasks}
            onCreateTask={() => setShowTaskForm(true)}
          />
        )}
        
        {activeSection === 'reports' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>
            <p className="text-gray-600">Reports section will be implemented here.</p>
          </div>
        )}
        {/* Create Intern Modal */}
        {showInternForm && (
          <InternForm 
            onClose={() => setShowInternForm(false)}
            onSuccess={(internData) => {
              setInterns((prev) => [...prev, internData]);
              setShowInternForm(false);
            }}
          />
        )}

        {/* Create Task Modal */}
        {showTaskForm && (
          <TaskForm
            onClose={() => setShowTaskForm(false)}
            onSuccess={(task) => {
              setTasks((prev) => [task, ...prev]);
              setShowTaskForm(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;