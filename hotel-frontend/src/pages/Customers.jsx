import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ maKh: '', tenKh: '', sdt: '', email: '', diachi: '' });

  useEffect(() => { fetchCustomers(currentPage); }, [currentPage]);

  const fetchCustomers = async (page) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/customers?page=${page - 1}&size=${pageSize}`);
      setCustomers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
        if (isEdit) {
            await axiosClient.put(`/api/customers/${formData.maKh}`, formData);
            alert("Cập nhật thành công!");
        } else {
            await axiosClient.post('/api/customers', formData);
            alert("Thêm mới thành công!");
        }
        setShowModal(false);
        fetchCustomers(currentPage);
        setFormData({});
    } catch (e) { alert("Lỗi: " + e.message); }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Xóa khách hàng này?")) return;
      try {
          await axiosClient.delete(`/api/customers/${id}`);
          fetchCustomers(currentPage);
      } catch (e) { alert("Không thể xóa (đang có dữ liệu liên quan)"); }
  };

  const columns = [
    { header: 'Mã KH', accessor: 'maKh', render: (row) => <span className="font-mono font-bold">{row.maKh}</span> },
    { header: 'Họ Tên', accessor: 'tenKh' },
    { header: 'SĐT', accessor: 'sdt' },
    { header: 'Email', accessor: 'email' },
    { header: 'Địa chỉ', accessor: 'diachi' },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Quản lý Khách Hàng</h1>
        <button onClick={() => { setIsEdit(false); setFormData({}); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark">+ Thêm Khách</button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={customers} loading={loading} actions={(row) => (
             <div className="flex gap-2 justify-end">
                <button onClick={() => { setFormData(row); setIsEdit(true); setShowModal(true); }} className="text-blue-600 hover:underline">Sửa</button>
                <button onClick={() => handleDelete(row.maKh)} className="text-red-600 hover:underline">Xóa</button>
             </div>
        )} />
        {/* Copy UI Phân trang vào đây */}
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
                  <h3 className="text-xl font-bold dark:text-white">{isEdit ? 'Sửa' : 'Thêm'} Khách Hàng</h3>
                  <div className="space-y-3">
                      <input placeholder="Họ tên" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.tenKh || ''} onChange={e => setFormData({...formData, tenKh: e.target.value})} />
                      <input placeholder="SĐT" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.sdt || ''} onChange={e => setFormData({...formData, sdt: e.target.value})} />
                      <input placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                      <input placeholder="Địa chỉ" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={formData.diachi || ''} onChange={e => setFormData({...formData, diachi: e.target.value})} />
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