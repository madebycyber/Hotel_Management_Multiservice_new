import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function LoaiPhong() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // State form
  const [formData, setFormData] = useState({ tenLoaiPhong: '', gia: '' });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await axiosClient.get('/api/loai-phong');
      setTypes(res.data);
    } catch (error) {
      console.error("Lỗi tải loại phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.tenLoaiPhong || !formData.gia) {
        alert("Vui lòng nhập đủ thông tin");
        return;
    }

    try {
      // POST /api/loai-phong
      await axiosClient.post('/api/loai-phong', {
          ...formData,
          gia: parseFloat(formData.gia) // Đảm bảo gửi số lên backend
      });
      setShowModal(false);
      setFormData({ tenLoaiPhong: '', gia: '' });
      fetchTypes();
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
    <div className="space-y-6 dashboard-container h-full overflow-y-auto p-4 sm:p-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cấu hình Loại Phòng</h1>
          <p className="text-gray-500 dark:text-gray-400">Thiết lập giá và tên các hạng phòng</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-lg shadow-primary/30"
        >
          + Thêm loại mới
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={types} loading={loading} />
      </div>

      {/* Modal Thêm Loại Phòng */}
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
                 <button 
                    onClick={() => setShowModal(false)} 
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                 >
                    Hủy
                 </button>
                 <button 
                    onClick={handleSubmit} 
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md"
                 >
                    Lưu lại
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}