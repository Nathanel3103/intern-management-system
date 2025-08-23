import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { tasksAPI } from "../../services/api";
import {
  FiClock,
  FiCheck,
  FiCalendar,
  FiAlertCircle,
  FiUser,
  FiPlay,
  FiCheckCircle,
} from "react-icons/fi";

const InternDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overallProgress: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [  tasks]);

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.list();
      setTasks(res);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress" && t.progress > 0).length;
    const notStarted = tasks.filter((t) => t.progress === 0).length;
    const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({
      total,
      completed,
      inProgress,
      notStarted,
      overallProgress,
    });
  };

  const handleTaskAction = async (taskId, action, progress = null) => {
    try {
      let data = { action };
      if (progress !== null) {
        data.progress = progress;
      }
      
      // Use the interact API for task actions
      await tasksAPI.interact(taskId, action, data);
      // Refresh tasks after action
      await fetchTasks();
    } catch (error) {
      console.error("Error performing task action:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name || "Intern"}
          </h1>
          <p className="text-gray-500">Track your tasks & progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <FiUser className="text-gray-700" />
          <span className="text-gray-700">{user?.email}</span>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center space-x-3">
            <FiCheck className="text-green-500 text-xl" />
            <h2 className="text-lg font-semibold">Completed Tasks</h2>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {stats.completed}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center space-x-3">
            <FiClock className="text-blue-500 text-xl" />
            <h2 className="text-lg font-semibold">In Progress</h2>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {stats.inProgress}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center space-x-3">
            <FiAlertCircle className="text-yellow-500 text-xl" />
            <h2 className="text-lg font-semibold">Not Started</h2>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {stats.notStarted}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center space-x-3">
            <FiCalendar className="text-purple-500 text-xl" />
            <h2 className="text-lg font-semibold">Overall Progress</h2>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full"
              style={{ width: `${stats.overallProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-700">{stats.overallProgress}% complete</p>
        </div>
      </section>

      {/* Tasks List */}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiAlertCircle className="text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        <span>Due: {task.dueDate}</span>
                      </div>
                      <div className="flex items-center">
                        <FiAlertCircle className={`mr-1 ${
                          task.priority === 'High' ? 'text-red-400' : 
                          task.priority === 'Medium' ? 'text-orange-400' : 'text-gray-400'
                        }`} />
                        <span>Priority: {task.priority}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            task.status === "Completed"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Time tracking */}
                    <div className="mt-3 text-xs text-gray-500">
                      {task.started_at && (
                        <div>Started: {formatDate(task.started_at)}</div>
                      )}
                      {task.completed_at && (
                        <div>Completed: {formatDate(task.completed_at)}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    {/* Action Buttons */}
                    {task.status !== "Completed" && (
                      <>
                        {task.progress === 0 && (
                          <button
                            onClick={() => handleTaskAction(task.id, "start")}
                            className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                          >
                            <FiPlay className="mr-1" />
                            Start
                          </button>
                        )}
                        
                        {task.progress > 0 && task.progress < 100 && (
                          <div className="flex flex-col space-y-2">
                            <select
                              onChange={(e) => handleTaskAction(task.id, "update_progress", parseInt(e.target.value))}
                              value={task.progress}
                              className="px-2 py-1 border rounded-md"
                            >
                              {task.progress_options && Object.entries(task.progress_options).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                            
                            <button
                              onClick={() => handleTaskAction(task.id, "complete")}
                              className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            >
                              <FiCheckCircle className="mr-1" />
                              Complete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-center ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.progress > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default InternDashboard;