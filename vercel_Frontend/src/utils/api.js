import axios from 'axios';

// Create an axios instance with the correct base URL
const baseURL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

// Log which URL we're using
console.log('API Base URL:', api.defaults.baseURL || 'Using proxy');

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwttoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api; 