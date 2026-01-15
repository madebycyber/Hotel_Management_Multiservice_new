// src/pages/BookingDetails.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import Pagination from '../components/Shared/Pagination'; // <--- Import
import axiosClient from '../api/axiosClient';

export default function BookingDetails() {
  const [activeBookings, setActiveBookings] = useState([]); 
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang Client-side
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // Số dòng mỗi trang

  // State Modal "Order Dịch Vụ" (Giữ nguyên)
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [order, setOrder] = useState({ maDatPhong: '', maDichVu: '', soLuong: 1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resBookings, resServices] = await Promise.all([
          axiosClient.get('/api/bookings?page=0&size=100'),
          axiosClient.get('/api/dich-vu?size=100')
      ]);
      
      const active = resBookings.data.content.filter(b => b.trangThai === 'Đã đặt');
      setActiveBookings(active);
      setServices(resServices.data.content || resServices.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // --- LOGIC CẮT TRANG (CLIENT SIDE) ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = activeBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activeBookings.length / ITEMS_PER_PAGE);

  // ... (Hàm handleAddService giữ nguyên) ...
  const handleAddService = async () => { /* Code cũ của bạn */ };

  // ... (Columns giữ nguyên) ...
  const columns = [
    { header: 'Mã Booking', accessor: 'maDatPhong', render: (row) => <span className="font-mono font-bold">#{row.maDatPhong}</span> },
    { header: 'Phòng', accessor: 'maPhong', render: (row) => <span className="text-lg font-bold text-primary">P.{row.maPhong}</span> },
    { header: 'Khách Hàng', accessor: 'khachHang', render: (row) => row.khachHang?.tenKh },
    { header: 'Ngày Check-in', accessor: 'ngayCheckIn', render: (row) => new Date(row.ngayCheckIn).toLocaleDateString('vi-VN') },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      {/* Header (Giữ nguyên) */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Gọi Dịch Vụ / Room Service</h1>
          <p className="text-gray-500 dark:text-gray-400">Thêm dịch vụ cho các phòng đang hoạt động</p>
        </div>
        <button onClick={() => setShowOrderModal(true)} className="bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-lg shadow-lg font-bold">
          + Gọi Dịch Vụ
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
        <h3 className="mb-4 font-semibold dark:text-gray-300">Danh sách phòng đang ở ({activeBookings.length})</h3>
        
        {/* Truyền currentItems (đã cắt) vào DataTable thay vì activeBookings */}
        <DataTable 
            columns={columns} 
            data={currentItems} 
            loading={loading} 
            actions={(row) => (
                <button 
                    onClick={() => { setOrder({...order, maDatPhong: row.maDatPhong}); setShowOrderModal(true); }}
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1 rounded transition-colors text-sm font-medium"
                >
                    + Thêm món
                </button>
            )}
        />

        {/* --- THÊM PHÂN TRANG CLIENT SIDE --- */}
        <div className="mt-4 border-t pt-4 border-gray-100 dark:border-gray-700">
             <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />
        </div>
      </div>

      {/* MODAL GỌI DỊCH VỤ */}
      {showOrderModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
                  <h3 className="text-3xl font-bold text-primary-dark dark:text-primary">Thêm Dịch Vụ Vào Phòng</h3>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Chọn Phòng (Booking)</label>
                          <select 
                             className="w-full p-2.5 border rounded dark:bg-gray-700 dark:text-white"
                             value={order.maDatPhong}
                             onChange={e => setOrder({...order, maDatPhong: e.target.value})}
                          >
                              <option value="">-- Chọn phòng --</option>
                              {activeBookings.map(b => (
                                  <option key={b.maDatPhong} value={b.maDatPhong}>
                                      Phòng {b.maPhong} - {b.khachHang?.tenKh}
                                  </option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Dịch Vụ</label>
                          <select 
                             className="w-full p-2.5 border rounded dark:bg-gray-700 dark:text-white"
                             value={order.maDichVu}
                             onChange={e => setOrder({...order, maDichVu: e.target.value})}
                          >
                              <option value="">-- Chọn món --</option>
                              {services.map(s => (
                                  <option key={s.maDichVu} value={s.maDichVu}>
                                      {s.tenDichVu} - {s.donGia?.toLocaleString()} đ
                                  </option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Số Lượng</label>
                          <input 
                              type="number" min="1"
                              className="w-full p-2.5 border rounded dark:bg-gray-700 dark:text-white"
                              value={order.soLuong}
                              onChange={e => setOrder({...order, soLuong: parseInt(e.target.value)})}
                          />
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setShowOrderModal(false)} className="px-4 py-2 border rounded dark:text-white">Đóng</button>
                      <button onClick={handleAddService} className="px-4 py-2 bg-primary text-white rounded shadow">Xác nhận</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}