import React from 'react';
import { 
  FiPlus, FiEye, FiEdit2, FiTrash2, 
  FiMail, FiBriefcase, FiUsers, FiActivity,
  FiCheck
} from 'react-icons/fi';

const InternManagement = ({ interns = [], onAddNew, loading = false, error = '' }) => {
  //  easy Debugging
  console.log('Rendering InternManagement with:', { interns, onAddNew });
  
  if (!interns || !Array.isArray(interns)) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 text-red-500">
        Error: Invalid interns data
      </div>
    );
  }

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
          onClick={() => {
            console.log('Add New clicked'); // Debug click
            onAddNew?.(); // Safe call
          }}
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

      {/* Interns Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {["Intern", "Role", "Department", "Status", "Progress", "Actions"].map((head) => (
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
            {interns.map((intern) => {
              if (!intern.id) {
                console.error('Intern missing id:', intern);
                return null;
              }
              
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
                        {intern.email && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FiMail className="h-3 w-3" /> {intern.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-1">
                    <FiBriefcase className="text-gray-400" /> {intern.role || 'N/A'}
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {intern.department || 'N/A'}
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

                  {/* Progress */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-28 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            intern.status === "Active" ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${intern.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{intern.progress || 0}%</span>
                    </div>
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternManagement;