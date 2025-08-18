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
  getMe: () => api.get('users/me/').then(res => res.data),
  
  // Helper to check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  // Logout helper
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api;
