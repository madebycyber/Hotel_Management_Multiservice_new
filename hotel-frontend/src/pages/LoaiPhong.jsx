import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function LoaiPhong() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // State form & Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ tenLoaiPhong: '', gia: '' });

  // 1. Gọi API khi trang thay đổi
  useEffect(() => {
    fetchTypes(currentPage);
  }, [currentPage]);

  const fetchTypes = async (page) => {
    try {
      setLoading(true);
      // Gọi API phân trang: Backend (0-based) vs Frontend (1-based)
      const res = await axiosClient.get(`/api/loai-phong?page=${page - 1}&size=${pageSize}`);
      
      // Cập nhật state từ Page object của Spring
      setTypes(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error("Lỗi tải loại phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSubmit = async () => {
    if (!formData.tenLoaiPhong || !formData.gia) {
        alert("Vui lòng nhập đủ thông tin");
        return;
    }

    try {
      await axiosClient.post('/api/loai-phong', {
          ...formData,
          gia: parseFloat(formData.gia)
      });
      setShowModal(false);
      setFormData({ tenLoaiPhong: '', gia: '' });
      
      // Load lại trang 1 sau khi thêm mới
      if (currentPage === 1) {
          fetchTypes(1);
      } else {
          setCurrentPage(1);
      }
      
      alert("Thêm loại phòng thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm loại phòng");
    }
  };

  const columns = [
    { header: 'Mã Loại', accessor: 'maLoaiPhong', render: (row) => <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{row.maLoaiPhong}</span> },
    { header: 'Tên Loại Phòng', accessor: 'tenLoaiPhong', render: (row) => <span className="font-bold text-primary">{row.tenLoaiPhong}</span> },
    { header: 'Giá Niêm Yết', accessor: 'gia', render: (row) => <span className="font-medium text-green-600 dark:text-green-400">{row.gia?.toLocaleString()} VNĐ</span> },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Cấu hình Loại Phòng</h1>
          <p className="text-gray-600 dark:text-gray-400">Danh sách ({totalElements} loại phòng)</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-lg shadow-primary/30 transition-all"
        >
          + Thêm loại mới
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[500px]">
        {/* Table */}
        <DataTable columns={columns} data={types} loading={loading} />

        {/* UI Phân trang Server-side */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trang {currentPage} / {totalPages}
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 Trước
              </button>
              
              {/* Hiển thị số trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages) 
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                        currentPage === page
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        {page}
                    </button>
                  </React.Fragment>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm Loại Phòng (Giữ nguyên như cũ) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm space-y-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loại phòng mới</h3>
              <div className="space-y-3">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên loại phòng</label>
                      <input 
                        placeholder="VD: Phòng VIP, Phòng Đơn" 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        value={formData.tenLoaiPhong}
                        onChange={(e) => setFormData({...formData, tenLoaiPhong: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá mỗi đêm (VNĐ)</label>
                      <input 
                        type="number"
                        placeholder="VD: 500000" 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        value={formData.gia}
                        onChange={(e) => setFormData({...formData, gia: e.target.value})}
                      />
                  </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Hủy</button>
                 <button onClick={handleSubmit} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md">Lưu lại</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}