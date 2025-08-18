import React from 'react';
import { 
  FiCheck, FiStar, FiClock, FiAlertCircle,
  FiArrowUpRight, FiUser, FiFileText, FiPieChart
} from 'react-icons/fi';
 

const DashboardStats = ({ stats, activities, tasks, quickActions, onActionClick }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  {stat.change.includes('+') ? (
                    <FiArrowUpRight className="text-green-500" />
                  ) : (
                    <FiAlertCircle className="text-blue-500" />
                  )}
                  {stat.change}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                >
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                    <FiCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      <span className="text-gray-900">{activity.name}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FiClock className="h-3 w-3" /> {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Task Progress */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Task Progress</h2>
              <button className="text-blue-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                View All <FiArrowUpRight />
              </button>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                      task.status === 'In Progress' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {task.status === 'In Progress' ? <FiClock className="h-3 w-3" /> : <FiCheck className="h-3 w-3" />}
                      {task.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        task.status === 'In Progress' ? 'bg-orange-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Assigned to: {task.assignedTo}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Quick Actions & Top Interns */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg hover:scale-[1.02] transition-transform flex items-center space-x-4"
                  onClick={() => onActionClick(action.action)}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Top Interns */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Interns</h2>
              <button className="text-blue-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                View All <FiArrowUpRight />
              </button>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center space-x-4 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-colors"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    {task.assignedTo.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.assignedTo}</h3>
                    <p className="text-sm text-gray-600">Assigned to {task.title}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <FiStar className="fill-current" />
                    <span className="font-bold text-blue-600"  >4.8</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;