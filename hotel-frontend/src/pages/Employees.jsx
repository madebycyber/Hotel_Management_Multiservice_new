import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ maNv: '', tenNv: '', email: '', sdt: '', diaChi: '' });

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  const fetchEmployees = async (page) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/employees?page=${page - 1}&size=${pageSize}`);
      setEmployees(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
      try {
          if (isEdit) {
              await axiosClient.put(`/api/employees/${formData.maNv}`, formData);
              alert("Cập nhật thành công!");
          } else {
              await axiosClient.post('/api/employees', formData);
              alert("Thêm nhân viên thành công!");
          }
          setShowModal(false);
          fetchEmployees(currentPage);
          setFormData({ maNv: '', tenNv: '', email: '', sdt: '', diaChi: '' });
      } catch (e) { alert("Lỗi: " + (e.response?.data || e.message)); }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Xóa nhân viên này?")) return;
      try {
          await axiosClient.delete(`/api/employees/${id}`);
          fetchEmployees(currentPage);
      } catch (e) { alert("Không thể xóa: " + e.response?.data); }
  };

  const openEdit = (row) => {
      setFormData(row);
      setIsEdit(true);
      setShowModal(true);
  };

  const columns = [
    { header: 'Mã NV', accessor: 'maNv', render: (row) => <span className="font-mono font-bold text-primary">{row.maNv}</span> },
    { header: 'Họ Tên', accessor: 'tenNv' },
    { header: 'Email', accessor: 'email' },
    { header: 'SĐT', accessor: 'sdt' },
    { header: 'Địa chỉ', accessor: 'diaChi' },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Quản lý Nhân Viên</h1>
        <button onClick={() => { setIsEdit(false); setFormData({}); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark">
            + Thêm Nhân viên
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable 
            columns={columns} 
            data={employees} 
            loading={loading}
            actions={(row) => (
                <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(row.maNv)} className="text-red-600 hover:underline">Xóa</button>
                </div>
            )}
        />
        {/* Pagination UI Code (Bạn copy đoạn phân trang từ các bài trước) */}
      </div>

      {/* Modal Form */}
      {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
                  <h3 className="text-xl font-bold dark:text-white">{isEdit ? 'Sửa' : 'Thêm'} Nhân Viên</h3>
                  <div className="space-y-3">
                      <input placeholder="Họ tên" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.tenNv || ''} onChange={e => setFormData({...formData, tenNv: e.target.value})} />
                      <input placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                      <input placeholder="Số điện thoại" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.sdt || ''} onChange={e => setFormData({...formData, sdt: e.target.value})} />
                      <input placeholder="Địa chỉ" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.diaChi || ''} onChange={e => setFormData({...formData, diaChi: e.target.value})} />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded dark:text-white">Hủy</button>
                      <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded">Lưu</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}