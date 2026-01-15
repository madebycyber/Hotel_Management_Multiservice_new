import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]); // State lưu danh sách loại phòng
  const [loading, setLoading] = useState(true);
  
  // State cho Modal thêm phòng
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ 
    soPhong: '', 
    loaiPhongId: '', 
    trangThai: 'Available', // Mặc định là Trống
    moTa: '' 
  });

  // 1. Lấy dữ liệu từ API khi vào trang
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi song song cả 2 API: Lấy phòng và Lấy loại phòng
      const [resRooms, resTypes] = await Promise.all([
        axiosClient.get('/api/rooms'),
        axiosClient.get('/api/loai-phong')
      ]);
      
      setRooms(resRooms.data);
      setRoomTypes(resTypes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Tạo phòng mới
  const handleCreateRoom = async () => {
    if (!newRoom.soPhong || !newRoom.loaiPhongId) {
      alert("Vui lòng nhập số phòng và chọn loại phòng!");
      return;
    }

    try {
      await axiosClient.post('/api/rooms', newRoom);
      setShowModal(false);
      fetchData(); // Load lại bảng
      alert("Thêm phòng thành công!");
      // Reset form
      setNewRoom({ soPhong: '', loaiPhongId: '', trangThai: 'Available', moTa: '' });
    } catch (error) {
      console.error(error);
      alert("Lỗi thêm phòng! Có thể số phòng đã tồn tại.");
    }
  };

  const columns = [
    { header: 'Mã Phòng', accessor: 'maPhong', render: (row) => <span className="font-bold text-primary">#{row.maPhong}</span> },
    { header: 'Số Phòng', accessor: 'soPhong', render: (row) => <span className="font-bold text-lg">{row.soPhong}</span> },
    { header: 'Loại Phòng', accessor: 'loaiPhong', render: (row) => row.loaiPhong?.tenLoaiPhong || <span className="text-gray-400 italic">Chưa phân loại</span> },
    { header: 'Giá/Đêm', accessor: 'loaiPhong', render: (row) => <span className="font-medium text-gray-700 dark:text-gray-300">{row.loaiPhong?.gia?.toLocaleString()} đ</span> },
    { 
      header: 'Trạng thái', 
      accessor: 'trangThai',
      render: (row) => {
        const statusColors = {
            'Available': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'Occupied': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'Maintenance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[row.trangThai] || 'bg-gray-100'}`}>
            {row.trangThai}
          </span>
        )
      }
    },
  ];

  return (
    <div className="space-y-6 dashboard-container h-full overflow-y-auto p-4 sm:p-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Phòng</h1>
          <p className="text-gray-500 dark:text-gray-400">Danh sách phòng và trạng thái</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-lg shadow-primary/30 transition-all"
        >
          + Thêm phòng
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={rooms} loading={loading} />
      </div>

      {/* Modal Thêm phòng */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thêm phòng mới</h3>
              
              <div className="space-y-3">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số phòng</label>
                      <input 
                        placeholder="VD: 101" 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        value={newRoom.soPhong}
                        onChange={(e) => setNewRoom({...newRoom, soPhong: e.target.value})}
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại phòng</label>
                      
                      <select 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        value={newRoom.loaiPhongId}
                        onChange={(e) => setNewRoom({...newRoom, loaiPhongId: e.target.value})}
                      >
                          <option value="">-- Chọn loại phòng --</option>
                          {roomTypes.map(type => (
                              <option key={type.maLoaiPhong} value={type.maLoaiPhong}>
                                  {type.tenLoaiPhong} - {type.gia?.toLocaleString()} đ
                              </option>
                          ))}
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái ban đầu</label>
                      <select 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        value={newRoom.trangThai}
                        onChange={(e) => setNewRoom({...newRoom, trangThai: e.target.value})}
                      >
                          <option value="Available">Available (Trống)</option>
                          <option value="Occupied">Occupied (Đang ở)</option>
                          <option value="Maintenance">Maintenance (Bảo trì)</option>
                      </select>
                  </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                 <button 
                    onClick={() => setShowModal(false)} 
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                 >
                    Hủy
                 </button>
                 <button 
                    onClick={handleCreateRoom} 
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md transition-colors"
                 >
                    Lưu Phòng
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}