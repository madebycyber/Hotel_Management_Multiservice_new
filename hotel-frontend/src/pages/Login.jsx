import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary-dark">
          Đăng nhập HotelHub
        </h2>

        {location.search.includes('expired') && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
          </div>
        )}

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-accent hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
}