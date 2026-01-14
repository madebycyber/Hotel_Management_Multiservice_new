import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import Pagination from '../components/Shared/Pagination';
import axiosClient from '../api/axiosClient';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // List role cho dropdown
  const [loading, setLoading] = useState(true);
  
  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
      tenDangNhap: '', matKhau: '', tenDayDu: '', email: '', sdt: '', maVaiTro: 'vt002'
  });

  useEffect(() => {
    fetchUsers(currentPage);
    fetchRoles();
  }, [currentPage]);

  const fetchRoles = async () => {
      try {
          const res = await axiosClient.get('/api/admin/permissions/roles');
          setRoles(res.data);
      } catch(e) { console.error(e); }
  }

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/admin/users?page=${page - 1}&size=10`);
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
      e.preventDefault();
      try {
          await axiosClient.post('/api/admin/users/create', newUser);
          alert("Tạo người dùng thành công!");
          setShowModal(false);
          setNewUser({ tenDangNhap: '', matKhau: '', tenDayDu: '', email: '', sdt: '', maVaiTro: 'vt002' });
          fetchUsers(currentPage); // Reload list
      } catch (error) {
          alert("Lỗi: " + (error.response?.data || error.message));
      }
  }

  const columns = [
    { header: 'Mã ND', accessor: 'maNguoiDung', render: (row) => <span className="font-mono text-xs">{row.maNguoiDung}</span> },
    { header: 'Tên đăng nhập', accessor: 'tenDangNhap', render: (row) => <span className="font-bold text-gray-700">{row.tenDangNhap}</span> },
    { header: 'Họ và tên', accessor: 'tenDayDu' },
    { header: 'Vai trò', accessor: 'vaiTro', render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${row.vaiTro?.maVaiTro === 'vt001' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {row.vaiTro?.tenVaiTro}
        </span>
    )},
    { header: 'Trạng thái', accessor: 'trangThai', render: (row) => <span className="text-green-600 text-xs">● {row.trangThai}</span> }
  ];

  return (
    <div className="space-y-6 dashboard-container p-4 sm:p-6">
       <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Quản lý Người dùng</h1>
          <p className="text-gray-600 dark:text-gray-400">Tổng số: {totalElements} tài khoản</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow transition font-bold"
        >
            + Thêm User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={users} loading={loading} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* MODAL TẠO USER */}
      {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Tạo Người Dùng Mới</h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tên đăng nhập</label>
                              <input required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
                                  value={newUser.tenDangNhap} onChange={e => setNewUser({...newUser, tenDangNhap: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Mật khẩu</label>
                              <input required type="password" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
                                  value={newUser.matKhau} onChange={e => setNewUser({...newUser, matKhau: e.target.value})} />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Họ và Tên</label>
                          <input required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
                              value={newUser.tenDayDu} onChange={e => setNewUser({...newUser, tenDayDu: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                              <input type="email" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
                                  value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">SĐT</label>
                              <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
                                  value={newUser.sdt} onChange={e => setNewUser({...newUser, sdt: e.target.value})} />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Vai trò</label>
                          <select className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                              value={newUser.maVaiTro} onChange={e => setNewUser({...newUser, maVaiTro: e.target.value})}>
                              {roles.map(r => (
                                  <option key={r.maVaiTro} value={r.maVaiTro}>{r.tenVaiTro}</option>
                              ))}
                          </select>
                      </div>

                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Tạo mới</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}