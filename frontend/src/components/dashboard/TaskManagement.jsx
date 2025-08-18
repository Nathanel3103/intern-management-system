import React from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiUser, 
  FiCalendar, FiAlertCircle, FiCheck, 
  FiClock, FiActivity
} from 'react-icons/fi';

const TaskManagement = ({ tasks, onCreateTask }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <FiActivity className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900">
            Task Management
          </h2>
        </div>
        <button
          onClick={onCreateTask}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center space-x-2"
        >
          <FiPlus className="h-5 w-5" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Task Cards */}
      <div className="space-y-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              {/* Task Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      task.status === 'In Progress'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.status === 'In Progress' ? (
                      <FiClock className="h-3 w-3" />
                    ) : (
                      <FiCheck className="h-3 w-3" />
                    )}
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {task.description || 'No description provided.'}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {/* Assigned To */}
                  <div className="flex items-center space-x-2">
                    <FiUser className="h-4 w-4 text-gray-400" />
                    <span>{task.assignedTo}</span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="h-4 w-4 text-gray-400" />
                    <span>Due: {task.dueDate}</span>
                  </div>

                  {/* Priority */}
                  <div className="flex items-center space-x-2">
                    <FiAlertCircle className={`h-4 w-4 ${
                      task.priority === 'High' ? 'text-red-400' : 
                      task.priority === 'Medium' ? 'text-orange-400' : 'text-gray-400'
                    }`} />
                    <span>Priority: {task.priority}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        task.status === 'In Progress'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 ml-4">
                {/* Edit */}
                <button 
                  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  title="Edit task"
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
                {/* Delete */}
                <button 
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  title="Delete task"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;