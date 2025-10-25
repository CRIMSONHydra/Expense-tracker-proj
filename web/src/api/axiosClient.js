import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Adjust if your backend port is different
});

// Interceptor to add the token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;