import React, { useEffect, useState } from 'react';
import { FiX, FiUser, FiCalendar, FiAlertCircle, FiFileText, FiAlignLeft } from 'react-icons/fi';
import { internsAPI, tasksAPI } from '../../services/api';

const priorities = ['HIGH', 'MEDIUM', 'LOW'];

const TaskForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to_user_id: '',
    due_date: '',
    priority: 'MEDIUM',
  });
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
  const loadInterns = async () => {
    try {
      const data = await internsAPI.list();
      setInterns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load interns:', err);
      setInterns([]);
    }
  };
  loadInterns();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.assigned_to_user_id) newErrors.assigned_to_user_id = 'Please select an intern';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigned_to_user_id: Number(formData.assigned_to_user_id),
        due_date: formData.due_date,
        priority: formData.priority,
      };
      const created = await tasksAPI.create(payload);

      // Ensure display fields for TaskManagement.jsx
      const assignedIntern = interns.find((i) => i.id === payload.assigned_to_user_id);
      const displayTask = {
        id: created?.id ?? Math.floor(Math.random() * 1e9),
        title: created?.title ?? payload.title,
        description: created?.description ?? payload.description,
        status: created?.status ?? 'In Progress',
        assignedTo: created?.assignedTo ?? (assignedIntern ? (assignedIntern.name || assignedIntern.email) : 'Unknown'),
        dueDate: created?.dueDate ?? payload.due_date,
        priority: created?.priority ?? payload.priority,
        progress: created?.progress ?? 0,
      };

      onSuccess?.(displayTask);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.detail ||
          Object.values(error.response?.data || {})[0]?.[0] ||
          'Failed to create task. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create Task</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline mr-2" />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter task title"
              disabled={loading}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiAlignLeft className="inline mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-300"
              placeholder="Add task details (optional)"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="inline mr-2" />
              Assign to Intern
            </label>
            <select
              name="assigned_to_user_id"
              value={formData.assigned_to_user_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.assigned_to_user_id ? 'border-red-500' : 'border-gray-300'}`}
              disabled={loading}
            >
              <option value="">Select intern</option>
              {interns.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name || i.email}
                </option>
              ))}
            </select>
            {errors.assigned_to_user_id && (
              <p className="text-red-500 text-sm mt-1">{errors.assigned_to_user_id}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline mr-2" />
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.due_date ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiAlertCircle className="inline mr-2" />
                Priority
              </label>
              <select
  name="priority"
  value={formData.priority}
  onChange={handleChange}
  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-300"
  disabled={loading}
>
  {priorities.map((p) => (
    <option key={p} value={p}>
      {p.charAt(0) + p.slice(1).toLowerCase()}  
    </option>
  ))}
</select>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {loading ? 'Creating Task...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;


