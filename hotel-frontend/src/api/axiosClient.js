import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Gọi qua Gateway
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Trước khi gửi request, kiểm tra xem có token không
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;