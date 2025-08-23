import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (can be removed in production)
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Log response for debugging (can be removed in production)
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden: You don\'t have permission for this action.');
          // Could integrate with toast notifications here
          break;
          
        case 404:
          // Not found
          console.error('Resource not found.');
          break;
          
        case 422:
          // Unprocessable entity (validation errors)
          console.error('Validation error:', data);
          break;
          
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error. Please try again later.');
          break;
          
        default:
          console.error('An error occurred:', data?.message || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error. Please check your connection.');
    } else {
      // Other errors
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register with name, email, password
  register: (data) => api.post('users/register/', data).then(res => res.data),
  
  // Login with email and password
  login: ({ email, password }) => 
    api.post('users/login/', { email, password })
      .then(response => {
        const { access } = response.data;
        if (!access) {
          throw new Error('No access token received from server');
        }
        localStorage.setItem('token', access);
        console.log('Token stored successfully:', access ? 'Yes' : 'No');
        return authAPI.getMe(); // Fetch and return user data after login
      }),
      
  // Get current user data
  getMe: async () => {
    try {
      const res = await api.get('users/me/');
      if (res?.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      }
      throw new Error("No user data received");
    } catch (error) {
      // Clear any stale data if token is invalid/expired
      localStorage.removeItem('user');

      if (error.response?.status === 401 || error.response?.status === 403) {
        // redirect to login or show message
        window.location.href = '/login';
      }

      throw error; // rethrow so caller can handle
    }
  },

  // Helper to check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  // Logout helper
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const internsAPI = {
  // List all interns (admin only)
  list: () => api.get('interns/').then(res => res.data),

  // List interns with progress data
  listWithProgress: () => api.get('interns-with-progress/').then(res => res.data),

  // Retrieve a single intern by user id (admin or self)
  retrieve: (id) => api.get(`interns/${id}/`).then(res => res.data),

  // Create an intern (admin only)
  create: ({ name, email, password, department }) =>
    api.post('interns/', { name, email, password, department }).then(res => res.data),
};

export const tasksAPI = {
  // List tasks (admin: all, intern: own)
  list: (params) => api.get('tasks/', { params }).then(res => res.data),
  
  // Create a task (admin only)
  create: (data) => api.post('tasks/', data).then(res => res.data),
  
  // Retrieve single task
  retrieve: (id) => api.get(`tasks/${id}/`).then(res => res.data),
  
  // Update (admin any; intern limited fields)
  update: (id, data) => api.patch(`tasks/${id}/`, data).then(res => res.data),
  
  // Delete (admin only)
  delete: (id) => api.delete(`tasks/${id}/`).then(res => res.data),
  
  // Task interaction (start, update progress, complete)
  interact: (taskId, action, data = {}) => 
    api.post(`tasks/${taskId}/interact/`, { action, ...data }).then(res => res.data),
};

export default api;