import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // Gọi qua API Gateway
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào mọi request nếu có
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Xử lý lỗi chung (VD: Hết hạn token thì logout)
axiosClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default axiosClient;