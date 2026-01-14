import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function Bookings() {
  // --- STATE DỮ LIỆU ---
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rooms, setRooms] = useState([]);         
  const [customers, setCustomers] = useState([]); 

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // --- STATE MODAL TẠO MỚI ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    maKhachHang: '',
    maPhong: '',
    ngayCheckIn: '',
    ngayCheckOut: ''
  });

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchMasterData = async () => {
      try {
          const [resRooms, resCust] = await Promise.all([
              axiosClient.get('/api/rooms?size=100'),
              axiosClient.get('/api/customers/list')       
          ]);

          const roomList = resRooms.data.content || resRooms.data;
          // Lưu ý: Kiểm tra xem DB trả về trạng thái là 'Trống', 'Available' hay 'Empty'
          // Nếu list phòng không hiện ra, hãy thử bỏ .filter() để debug
          setRooms(roomList.filter(r => r.trangThai === 'Trống' || r.trangThai === 'Available')); 
          
          setCustomers(resCust.data); 
      } catch (e) { 
          console.error("Lỗi tải dữ liệu nguồn:", e); 
      }
    };

  const fetchBookings = async (page) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/bookings?page=${page - 1}&size=${pageSize}`);
      setBookings(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error("Lỗi tải bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- SỬA LOGIC TẠI ĐÂY ---
  const handleCreateBooking = async () => {
      if(!newBooking.maKhachHang || !newBooking.maPhong || !newBooking.ngayCheckIn) {
          alert("Vui lòng nhập đủ thông tin!"); return;
      }

      try {
          // Chuẩn hóa dữ liệu trước khi gửi
          const payload = {
              ...newBooking,
              // 1. Ép về chữ thường (toLowerCase) để khớp với DB p030
              // 2. Cắt khoảng trắng thừa (trim) để tránh lỗi "p030 "
              maPhong: newBooking.maPhong.trim().toLowerCase(), 
              ngayCheckIn: new Date(newBooking.ngayCheckIn).toISOString(),
              ngayCheckOut: new Date(newBooking.ngayCheckOut).toISOString(),
              tongGia: 0
          };

          console.log("Payload gửi đi:", payload); // Debug xem gửi đi cái gì

          await axiosClient.post('/api/bookings', payload);
          
          alert("Đặt phòng thành công!");
          setShowCreateModal(false);
          fetchBookings(1); 
          fetchMasterData(); 
          
          setNewBooking({ maKhachHang: '', maPhong: '', ngayCheckIn: '', ngayCheckOut: '' });
      } catch (e) { 
          // Hiển thị thông báo lỗi chi tiết từ Backend trả về
          const errorMsg = e.response?.data?.message || e.response?.data || e.message;
          alert("Lỗi: " + errorMsg); 
      }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const columns = [
    { header: 'Mã DP', accessor: 'maDatPhong', render: (row) => <span className="font-bold text-primary">#{row.maDatPhong}</span> },
    { header: 'Khách Hàng', accessor: 'khachHang', render: (row) => <span className="font-medium">{row.khachHang?.tenKh || 'N/A'}</span> },
    { header: 'Phòng', accessor: 'maPhong', render: (row) => <span className="font-bold">P.{row.maPhong}</span> },
    { header: 'Check-In', accessor: 'ngayCheckIn', render: (row) => new Date(row.ngayCheckIn).toLocaleDateString('vi-VN') },
    { header: 'Check-Out', accessor: 'ngayCheckOut', render: (row) => new Date(row.ngayCheckOut).toLocaleDateString('vi-VN') },
    { 
      header: 'Trạng thái', 
      accessor: 'trangThai',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
            row.trangThai === 'Confirmed' ? 'bg-green-100 text-green-700' : 
            row.trangThai === 'Completed' ? 'bg-blue-100 text-blue-700' : 
            'bg-yellow-100 text-yellow-700'
        }`}>
          {row.trangThai}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Quản lý Đặt Phòng</h1>
          <p className="text-gray-600 dark:text-gray-400">Tổng số: {totalElements} phiếu</p>
        </div>
        <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-lg shadow-primary/30 transition-all"
        >
          + Tạo Booking
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[500px]">
        <DataTable columns={columns} data={bookings} loading={loading} />
        
        {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">Trang {currentPage} / {totalPages}</div>
                <div className="flex gap-1">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-gray-300">Trước</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => handlePageChange(p)} className={`px-3 py-1 border rounded ${currentPage === p ? 'bg-primary text-white' : 'dark:border-gray-600 dark:text-gray-300'}`}>{p}</button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-gray-300">Sau</button>
                </div>
            </div>
        )}
      </div>

      {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-2xl space-y-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold dark:text-white">Tạo Phiếu Đặt Phòng</h3>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Khách Hàng</label>
                          <select 
                             className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                             onChange={e => setNewBooking({...newBooking, maKhachHang: e.target.value})}
                             value={newBooking.maKhachHang}
                          >
                              <option value="">-- Chọn khách hàng --</option>
                              {customers.map(c => (
                                  <option key={c.maKh} value={c.maKh}>
                                      {c.tenKh} ({c.sdt})
                                  </option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Chọn Phòng Trống</label>
                          <select 
                             className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                             onChange={e => setNewBooking({...newBooking, maPhong: e.target.value})}
                             value={newBooking.maPhong}
                          >
                              <option value="">-- Chọn phòng --</option>
                              {rooms.length > 0 ? (
                                  rooms.map(r => (
                                      <option key={r.maPhong} value={r.maPhong}>
                                          {/* Hiển thị cả mã phòng để dễ debug */}
                                          Phòng {r.soPhong} (Mã: {r.maPhong}) - {r.loaiPhong?.tenLoaiPhong}
                                      </option>
                                  ))
                              ) : (
                                  <option disabled>Hết phòng trống</option>
                              )}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Check-In</label>
                              <input type="datetime-local" className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={e => setNewBooking({...newBooking, ngayCheckIn: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Check-Out</label>
                              <input type="datetime-local" className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={e => setNewBooking({...newBooking, ngayCheckOut: e.target.value})} />
                          </div>
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Hủy</button>
                      <button onClick={handleCreateBooking} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow">Lưu Phiếu</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}