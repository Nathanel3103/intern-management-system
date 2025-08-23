import React, { useEffect, useState } from 'react';
import { 
  FiPlus, FiEye, FiEdit2, FiTrash2, 
  FiMail, FiUsers, FiActivity,
  FiCheck, FiClock, FiTrendingUp
} from 'react-icons/fi';
import { internsAPI, tasksAPI } from "../../services/api";


const InternManagement = () => {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch interns + tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [internsData, tasksData] = await Promise.all([
          internsAPI.list(),
          tasksAPI.list()
        ]);
        setInterns(internsData);
        setTasks(tasksData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load interns or tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate intern progress based on their tasks
  const calculateInternProgress = (internId) => {
    const internTasks = tasks.filter(task => task.assigned_to === internId);
    if (internTasks.length === 0) return 0;
    
    const completedTasks = internTasks.filter(task => task.status === "Completed");
    return Math.round((completedTasks.length / internTasks.length) * 100);
  };

  // Calculate task statistics for each intern
  const getInternStats = (internId) => {
    const internTasks = tasks.filter(task => task.assigned_to === internId);
    const completed = internTasks.filter(task => task.status === "Completed").length;
    const inProgress = internTasks.filter(task => task.status === "In Progress" && task.progress > 0).length;
    const notStarted = internTasks.filter(task => task.progress === 0).length;
    
    return {
      total: internTasks.length,
      completed,
      inProgress,
      notStarted
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-transparent">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <FiUsers className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900">
            Intern Management
          </h2>
        </div>
        <button
          onClick={() => console.log("Add New Intern clicked")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <FiPlus className="h-5 w-5" />
          <span>Add New Intern</span>
        </button>
      </div>

      {/* Error/Loading */}
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}
      {loading && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200">Loading interns...</div>
      )}

      {/* Stats Summary */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiUsers className="text-blue-600 mr-2" />
              <span className="text-sm font-medium">Total Interns</span>
            </div>
            <div className="text-2xl font-bold mt-1">{interns.length}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiCheck className="text-green-600 mr-2" />
              <span className="text-sm font-medium">Active Interns</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {interns.filter(i => i.status === "Active").length}
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiClock className="text-orange-600 mr-2" />
              <span className="text-sm font-medium">Avg. Progress</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {interns.length > 0 
                ? Math.round(interns.reduce((sum, intern) => sum + calculateInternProgress(intern.id), 0) / interns.length) 
                : 0}%
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiTrendingUp className="text-purple-600 mr-2" />
              <span className="text-sm font-medium">Total Tasks</span>
            </div>
            <div className="text-2xl font-bold mt-1">{tasks.length}</div>
          </div>
        </div>
      )}

      {/* Interns Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {["Intern", "Contact", "Department", "Tasks", "Progress", "Status", "Actions"].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No interns found.
                  </td>
                </tr>
              ) : (
                interns.map((intern) => {
                  if (!intern.id) return null;
                  
                  const stats = getInternStats(intern.id);
                  const progress = calculateInternProgress(intern.id);
                  
                  return (
                    <tr
                      key={intern.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                    >
                      {/* Intern */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center mr-3 font-semibold">
                            {intern.name?.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {intern.name || 'No name'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {intern.email && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FiMail className="h-3 w-3" /> {intern.email}
                          </div>
                        )}
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {intern.department || 'N/A'}
                      </td>

                      {/* Tasks */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex flex-col space-y-1">
                            <div className="flex justify-between">
                              <span className="text-green-600">Completed:</span>
                              <span>{stats.completed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600">In Progress:</span>
                              <span>{stats.inProgress}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Not Started:</span>
                              <span>{stats.notStarted}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Total:</span>
                              <span>{stats.total}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-28 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                progress === 100 
                                  ? "bg-green-500" 
                                  : progress > 0 
                                    ? "bg-blue-500" 
                                    : "bg-gray-300"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{progress}%</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full items-center gap-1 ${
                            intern.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {intern.status === "Active" ? (
                            <FiActivity className="h-3 w-3" />
                          ) : (
                            <FiCheck className="h-3 w-3" />
                          )}
                          {intern.status || 'Unknown'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center gap-1">
                          <FiEye className="h-4 w-4" /> View
                        </button>
                        <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition flex items-center gap-1">
                          <FiEdit2 className="h-4 w-4" /> Edit
                        </button>
                        <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-1">
                          <FiTrash2 className="h-4 w-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InternManagement;
