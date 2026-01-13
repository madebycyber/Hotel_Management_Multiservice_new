import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Gọi API Login qua Gateway
      const res = await axiosClient.post('/api/auth/login', {
        username, // Đảm bảo khớp với field bên Backend (username/tenDangNhap)
        password
      });

      // Lưu token (giả sử backend trả về { result: { token: "..." } })
      if (res.data.result?.token) {
        localStorage.setItem('token', res.data.result.token);
        navigate('/'); // Chuyển về Dashboard
      } else {
        // Fallback nếu cấu trúc response khác
        localStorage.setItem('token', res.data.token); 
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-dark dark:text-primary">
            Đăng nhập hệ thống
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all"
            >
              Đăng nhập
            </button>
          </div>
          <div className="text-center text-sm">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}