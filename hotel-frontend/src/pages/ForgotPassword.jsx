import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, KeyIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// import axiosClient from '../api/axiosClient'; // Bỏ comment khi có API thật

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Xử lý Bước 1: Gửi OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API THẬT: await axiosClient.post('/api/auth/forgot-password', { email });
      
      // Giả lập
      setTimeout(() => {
        setLoading(false);
        setStep(2);
        // Trong thực tế không được alert OTP, đây chỉ là demo
        alert(`DEMO: Mã OTP của bạn là 123456`); 
      }, 1500);
    } catch (error) {
      alert("Email không tồn tại trong hệ thống!");
      setLoading(false);
    }
  };

  // Xử lý Bước 2: Đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API THẬT: await axiosClient.post('/api/auth/reset-password', { email, otp, newPassword });

      // Giả lập check OTP demo
      if (otp !== '123456') throw new Error("Mã OTP không đúng");

      setTimeout(() => {
        setLoading(false);
        alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        navigate('/login');
      }, 1500);
    } catch (error) {
      alert(error.message || "Lỗi đổi mật khẩu");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-dark dark:text-white">
          Khôi phục mật khẩu
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Đừng lo, chúng tôi sẽ giúp bạn lấy lại tài khoản.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-700">
          
          {step === 1 ? (
            /* --- STEP 1: NHẬP EMAIL --- */
            <form className="space-y-6" onSubmit={handleRequestOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email đăng ký
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Đang gửi mã...' : 'Gửi mã xác nhận'}
                </button>
              </div>
            </form>
          ) : (
            /* --- STEP 2: NHẬP OTP & PASS MỚI --- */
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Mã xác nhận đã gửi!</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Vui lòng kiểm tra email <strong>{email}</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mã OTP (6 số)</label>
                <input
                  type="text" required maxLength="6"
                  className="mt-1 block w-full py-3 text-center text-2xl tracking-widest font-mono border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu mới</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password" required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    placeholder="••••••••"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors"
              >
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Hoặc
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors items-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}