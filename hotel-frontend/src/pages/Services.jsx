import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE PHÂN TRANG SERVER-SIDE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // State Modal thêm mới (để sẵn nếu bạn muốn làm tính năng thêm DV)
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({ tenDichVu: '', donGia: '' });

  // 1. Gọi API khi trang thay đổi
  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const fetchServices = async (page) => {
    try {
      setLoading(true);
      // Gọi API phân trang: page - 1 vì Backend bắt đầu từ 0
      const res = await axiosClient.get(`/api/dich-vu?page=${page - 1}&size=${pageSize}`);
      
      // Cập nhật state từ response Page của Spring Boot
      setServices(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("Lỗi tải dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Hàm tạo dịch vụ (để sẵn logic)
  const handleCreateService = async () => {
     if(!newService.tenDichVu || !newService.donGia) return alert("Nhập đủ thông tin!");
     try {
         await axiosClient.post('/api/dich-vu', newService);
         setShowModal(false);
         fetchServices(1); // Load lại trang 1
         setNewService({ tenDichVu: '', donGia: '' });
         alert("Thêm thành công");
     } catch(e) { alert("Lỗi thêm dịch vụ"); }
  };

  const columns = [
    { header: 'Mã DV', accessor: 'maDichVu', render: (row) => <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{row.maDichVu}</span> },
    { header: 'Tên Dịch Vụ', accessor: 'tenDichVu', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.tenDichVu}</span> },
    { header: 'Đơn giá', accessor: 'donGia', render: (row) => <span className="text-primary font-bold">{row.donGia?.toLocaleString()} VNĐ</span> },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
           <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Dịch Vụ Khách Sạn</h1>
           <p className="text-gray-600 dark:text-gray-400">Danh sách dịch vụ ({totalElements} dịch vụ)</p>
        </div>
        <button 
           onClick={() => setShowModal(true)}
           className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-lg shadow-primary/30 transition-all"
        >
           + Thêm dịch vụ
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[500px]">
        {/* Table */}
        <DataTable columns={columns} data={services} loading={loading} />

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

      {/* Modal Thêm Dịch Vụ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm space-y-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thêm Dịch Vụ Mới</h3>
              <div className="space-y-3">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên dịch vụ</label>
                      <input 
                        placeholder="VD: Giặt ủi, Spa..." 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        value={newService.tenDichVu}
                        onChange={(e) => setNewService({...newService, tenDichVu: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đơn giá (VNĐ)</label>
                      <input 
                        type="number"
                        placeholder="VD: 50000" 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        value={newService.donGia}
                        onChange={(e) => setNewService({...newService, donGia: e.target.value})}
                      />
                  </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Hủy</button>
                 <button onClick={handleCreateService} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md">Lưu</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}