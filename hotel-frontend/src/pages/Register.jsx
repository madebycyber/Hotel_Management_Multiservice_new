import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '', // Tùy chỉnh theo DTO backend
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Gọi API Register
      await axiosClient.post('/api/auth/register', formData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      // Lấy message lỗi từ backend nếu có
      const msg = err.response?.data?.message || 'Đăng ký thất bại (Lỗi 403 thường do Security chặn)';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-center text-3xl font-extrabold text-primary-dark dark:text-primary">
          Đăng ký tài khoản
        </h2>
        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-center text-sm p-2 bg-red-50 rounded">{error}</div>}
          
          <input name="username" onChange={handleChange} placeholder="Tên đăng nhập" required className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <input name="password" type="password" onChange={handleChange} placeholder="Mật khẩu" required className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <input name="fullName" onChange={handleChange} placeholder="Tên đầy đủ" className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <button type="submit" className="w-full py-3 rounded-lg text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30 font-medium">
            Đăng ký
          </button>
          <div className="text-center text-sm mt-4">
            <Link to="/login" className="text-primary hover:underline">Quay lại đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}