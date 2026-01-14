import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-black text-red-500">403</h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Truy cập bị từ chối</h2>
      <p className="text-gray-600 mt-2 mb-8">
        Xin lỗi, bạn không có quyền truy cập vào trang này.
      </p>
      
      <button 
        onClick={() => navigate('/home')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}