import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // URL Backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Gắn Token vào mọi request gửi đi
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Xử lý lỗi trả về
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      // TRƯỜNG HỢP 1: 401 Unauthorized (Token hết hạn hoặc sai)
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // TRƯỜNG HỢP 2: 403 Forbidden (Không có quyền truy cập)
      if (response.status === 403) {
        // Cách A: Chuyển hướng sang trang báo lỗi 403
        window.location.href = '/403'; 
        
        // Cách B: Hoặc chỉ hiện thông báo (Alert) nếu không muốn chuyển trang
        // alert("Bạn không có quyền truy cập vào chức năng này!");
        
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;