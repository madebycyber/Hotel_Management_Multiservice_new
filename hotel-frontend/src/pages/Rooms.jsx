import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

// Base URL của server để hiển thị ảnh (VD: http://localhost:8080)
const BASE_URL = 'http://localhost:8080'; 

export default function Rooms() {
  const [rooms, setRooms] = useState([]); 
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [showModal, setShowModal] = useState(false);
  
  // State Form
  const [newRoom, setNewRoom] = useState({ 
    soPhong: '', loaiPhongId: '', trangThai: 'Trống', moTa: '' 
  });
  
  // State riêng cho File ảnh
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const [resRooms, resTypes] = await Promise.all([
        axiosClient.get(`/api/rooms?page=${page - 1}&size=${pageSize}`),
        axiosClient.get('/api/loai-phong?size=100') 
      ]);

      setRooms(resRooms.data.content || []); 
      setTotalPages(resRooms.data.totalPages);
      setTotalElements(resRooms.data.totalElements);
      
      if (resTypes.data && resTypes.data.content) {
          setRoomTypes(resTypes.data.content);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ CHỌN FILE ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        // Tạo URL tạm để xem trước ảnh
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- TẠO PHÒNG VỚI FORMDATA ---
  const handleCreateRoom = async () => {
    if (!newRoom.soPhong || !newRoom.loaiPhongId) {
       alert("Vui lòng nhập đủ thông tin!"); return;
    }

    try {
      // 1. Dùng FormData để gửi file + text
      const formData = new FormData();
      formData.append('soPhong', newRoom.soPhong);
      formData.append('loaiPhongId', newRoom.loaiPhongId);
      formData.append('trangThai', newRoom.trangThai);
      
      // Nếu có file thì append vào
      if (selectedFile) {
          formData.append('imageFile', selectedFile);
      }

      // 2. Gửi API (Content-Type sẽ tự động được set là multipart/form-data)
      await axiosClient.post('/api/rooms', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowModal(false);
      fetchData(1); 
      alert("Thêm phòng thành công!");
      
      // Reset form
      setNewRoom({ soPhong: '', loaiPhongId: '', trangThai: 'Trống', moTa: '' });
      setSelectedFile(null);
      setPreviewUrl(null);

    } catch (error) {
      console.error(error);
      alert("Lỗi thêm phòng: " + (error.response?.data?.message || error.message));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // --- CẤU HÌNH CỘT CÓ ẢNH ---
  const columns = [
    { 
        header: 'Ảnh', 
        accessor: 'image', 
        render: (row) => (
            <div className="w-16 h-12 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                {row.image ? (
                    <img 
                        src={`${BASE_URL}${row.image}`} 
                        alt={row.soPhong} 
                        className="w-full h-full object-cover"
                        onError={(e) => {e.target.src = 'https://placehold.co/100x100?text=No+Img'}} // Fallback nếu ảnh lỗi
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Img</div>
                )}
            </div>
        )
    },
    { header: 'Số Phòng', accessor: 'soPhong', render: (row) => <span className="font-bold text-lg">{row.soPhong}</span> },
    { header: 'Loại Phòng', accessor: 'loaiPhong', render: (row) => row.loaiPhong?.tenLoaiPhong || 'N/A' },
    { header: 'Giá', accessor: 'loaiPhong', render: (row) => row.loaiPhong?.gia?.toLocaleString() + ' đ' },
    { 
      header: 'Trạng thái', 
      accessor: 'trangThai',
      render: (row) => {
        const colors = {
            'Trống': 'bg-green-100 text-green-700',
            'Đang sử dụng': 'bg-red-100 text-red-700',
            'Bảo trì': 'bg-orange-100 text-orange-700'
        };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[row.trangThai] || 'bg-gray-100'}`}>{row.trangThai}</span>
      }
    },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Quản lý Phòng</h1>
          <p className="text-gray-600 dark:text-gray-400">Danh sách phòng ({totalElements} phòng)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-lg shadow-primary/30">
          + Thêm phòng
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[500px]">
        <DataTable columns={columns} data={rooms} loading={loading} />
        {/* ... (Phần phân trang giữ nguyên) ... */}
         {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex gap-1">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">Trước</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages) 
                .map(page => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 border rounded-md text-sm ${currentPage === page ? 'bg-primary text-white' : 'border-gray-300 dark:border-gray-600'}`}>{page}</button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">Sau</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thêm phòng mới</h3>
              <div className="space-y-3">
                  {/* UPLOAD ẢNH */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ảnh phòng</label>
                      <div className="flex items-center gap-4">
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                              {previewUrl ? (
                                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                  <span className="text-xs text-gray-400">No Img</span>
                              )}
                          </div>
                          <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                      </div>
                  </div>

                  {/* CÁC TRƯỜNG KHÁC */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số phòng</label>
                      <input 
                        placeholder="VD: 101" 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newRoom.soPhong}
                        onChange={(e) => setNewRoom({...newRoom, soPhong: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại phòng</label>
                      <select 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newRoom.loaiPhongId}
                        onChange={(e) => setNewRoom({...newRoom, loaiPhongId: e.target.value})}
                      >
                          <option value="">-- Chọn loại phòng --</option>
                          {Array.isArray(roomTypes) && roomTypes.map(type => (
                              <option key={type.maLoaiPhong} value={type.maLoaiPhong}>
                                  {type.tenLoaiPhong} - {type.gia?.toLocaleString()} đ
                              </option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái ban đầu</label>
                      <select 
                        className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newRoom.trangThai}
                        onChange={(e) => setNewRoom({...newRoom, trangThai: e.target.value})}
                      >
                          <option value="Trống">Trống</option>
                          <option value="Đang sử dụng">Đang sử dụng</option>
                          <option value="Bảo trì">Bảo trì</option>
                      </select>
                  </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
                 <button onClick={handleCreateRoom} className="px-4 py-2 bg-primary text-white rounded-lg shadow-md">Lưu Phòng</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}