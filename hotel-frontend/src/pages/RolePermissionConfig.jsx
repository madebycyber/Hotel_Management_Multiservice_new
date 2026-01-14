// src/pages/RolePermissionConfig.jsx
import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

// --- CẬP NHẬT DANH SÁCH TÀI NGUYÊN THEO GATEWAY CONFIG ---
const INITIAL_RESOURCES = [
    // === 1. IDENTITY SERVICE ===
    { name: "Auth (Đăng nhập/Đăng ký)", endpoint: "/api/auth/**", method: "POST" },
    { name: "Quản lý Người dùng (Full)", endpoint: "/api/users/**", method: "GET" },
    { name: "Quản lý Người dùng (Full)", endpoint: "/api/users/**", method: "POST" },
    { name: "Quản lý Người dùng admin (Full)", endpoint: "/api/admin/users/**", method: "GET" },
    { name: "Quản lý Người dùng admin (Full)", endpoint: "/api/admin/users/**", method: "POST" },
    { name: "Quản lý Phân quyền (Admin)", endpoint: "/api/admin/**", method: "GET" },
    { name: "Quản lý Phân quyền (Admin)", endpoint: "/api/admin/**", method: "POST" },
    { name: "API Roles", endpoint: "/api/roles/**", method: "GET" },
    
    // === 2. ROOM SERVICE ===
    { name: "Xem Phòng & Loại phòng", endpoint: "/api/rooms/**", method: "GET" },
    { name: "Quản lý Phòng (Thêm/Sửa)", endpoint: "/api/rooms/**", method: "POST" },
    { name: "Quản lý Phòng (Xóa)", endpoint: "/api/rooms/**", method: "DELETE" },
    { name: "Quản lý Loại phòng", endpoint: "/api/loai-phong/**", method: "POST" },
    { name: "Quản lý Dịch vụ (Phòng)", endpoint: "/api/dich-vu/**", method: "POST" },
    { name: "Quản lý Dịch vụ (Phòng:Xem)", endpoint: "/api/dich-vu/**", method: "GET" },
    { name: "Upload Ảnh", endpoint: "/images/**", method: "POST" },

    // === 3. BOOKING SERVICE ===
    { name: "Đặt phòng (Booking)", endpoint: "/api/bookings/**", method: "POST" },
    { name: "Xem Booking (Lịch sử)", endpoint: "/api/bookings/**", method: "GET" },
    { name: "Quản lý Khách hàng", endpoint: "/api/customers/**", method: "GET" },
    { name: "Quản lý Nhân viên", endpoint: "/api/employees/**", method: "GET" },
    { name: "Hóa đơn (Invoices)", endpoint: "/api/invoices/**", method: "GET" },
    { name: "Booking của User", endpoint: "/api/user/bookings/**", method: "GET" },
    { name: "Đặt phòng của User (Booking)", endpoint: "/api/user/bookings/**", method: "POST" },
    
    // === 4. SHARED (Cẩn thận trùng lặp) ===
    { name: "Dịch vụ chung (Services)", endpoint: "/api/services/**", method: "GET" },
];

export default function RolePermissionConfig() {
    const [roles, setRoles] = useState([]);
    const [currentPermissions, setCurrentPermissions] = useState([]);
    const [resources, setResources] = useState(INITIAL_RESOURCES); 
    const [loading, setLoading] = useState(false);

    // Modal States
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showApiModal, setShowApiModal] = useState(false);

    // Form States
    const [newRole, setNewRole] = useState({ maVaiTro: '', tenVaiTro: '' });
    const [newApi, setNewApi] = useState({ name: '', endpoint: '', method: 'GET' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [resRoles, resPerms] = await Promise.all([
                axiosClient.get('/api/admin/permissions/roles'),
                axiosClient.get('/api/admin/permissions/list')
            ]);
            setRoles(resRoles.data);
            setCurrentPermissions(resPerms.data);
        } catch (error) { console.error(error); }
    };

    // --- XỬ LÝ TẠO ROLE MỚI ---
    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/admin/permissions/roles/create', newRole);
            alert("Tạo Role thành công!");
            setShowRoleModal(false);
            setNewRole({ maVaiTro: '', tenVaiTro: '' });
            loadData();
        } catch (error) { alert("Lỗi tạo Role: " + error.response?.data); }
    };

    // --- XỬ LÝ THÊM API MỚI VÀO UI ---
    const handleAddApi = (e) => {
        e.preventDefault();
        setResources(prev => [...prev, newApi]);
        setShowApiModal(false);
        setNewApi({ name: '', endpoint: '', method: 'GET' });
    };

    // Hàm kiểm tra quyền để hiển thị checkbox
    const hasPermission = (roleCode, endpoint, method) => {
        return currentPermissions.some(p => p.rolecode === roleCode && p.apiendpoint === endpoint && p.httpmethod === method);
    };

    // --- XỬ LÝ KHI CLICK CHECKBOX (QUAN TRỌNG) ---
    const handleToggle = async (roleCode, resource, isChecked) => {
        // 1. Optimistic Update (Cập nhật giao diện ngay lập tức)
        const tempPerm = { 
            rolecode: roleCode, 
            apiendpoint: resource.endpoint, 
            httpmethod: resource.method 
        };
        
        if (isChecked) {
            setCurrentPermissions(prev => [...prev, tempPerm]);
        } else {
            setCurrentPermissions(prev => prev.filter(p => 
                !(p.rolecode === roleCode && p.apiendpoint === resource.endpoint && p.httpmethod === resource.method)
            ));
        }

        setLoading(true);
        try {
            // 2. Gọi API xuống Backend
            await axiosClient.post('/api/admin/permissions/update', {
                roleCode: roleCode,
                apiEndpoint: resource.endpoint,
                httpMethod: resource.method,
                enable: isChecked
            });
        } catch (error) {
            alert("Lỗi cập nhật quyền! Đang hoàn tác...");
            loadData(); // Revert lại dữ liệu cũ nếu lỗi
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Cấu hình Phân quyền</h1>
                <div className="space-x-3">
                    <button onClick={() => setShowApiModal(true)} className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-bold">
                        + Thêm API Mới
                    </button>
                    <button onClick={() => setShowRoleModal(true)} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark font-bold">
                        + Tạo Role Mới
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-800 text-white uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Chức năng / API Endpoint</th>
                            {roles.map(role => (
                                <th key={role.maVaiTro} className="px-6 py-4 text-center border-l border-gray-700">
                                    {role.tenVaiTro} <div className="text-xs text-gray-400">({role.maVaiTro})</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {resources.map((res, idx) => (
                            <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-gray-600 dark:text-gray-400 font-bold">{res.name}</div>
                                    <code className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">{res.method} {res.endpoint}</code>
                                </td>
                                {roles.map(role => (
                                    <td key={role.maVaiTro} className="px-6 py-4 text-center border-l border-gray-200">
                                        <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer"
                                            checked={hasPermission(role.maVaiTro, res.endpoint, res.method)}
                                            onChange={(e) => handleToggle(role.maVaiTro, res, e.target.checked)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL TẠO ROLE --- */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                        <h3 className="text-xl font-bold mb-4">Tạo Vai trò Mới</h3>
                        <form onSubmit={handleCreateRole} className="space-y-3">
                            <div>
                                <label className="block text-sm font-bold mb-1">Mã Role (VD: vt005)</label>
                                <input required className="w-full border p-2 rounded" 
                                    value={newRole.maVaiTro} onChange={e => setNewRole({...newRole, maVaiTro: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Tên Vai trò</label>
                                <input required className="w-full border p-2 rounded" 
                                    value={newRole.tenVaiTro} onChange={e => setNewRole({...newRole, tenVaiTro: e.target.value})} />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowRoleModal(false)} className="px-3 py-1 text-gray-500">Hủy</button>
                                <button type="submit" className="px-3 py-1 bg-primary text-white rounded">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL THÊM API --- */}
            {showApiModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                        <h3 className="text-xl font-bold mb-4">Khai báo API Mới</h3>
                        <p className="text-sm text-gray-500 mb-3">Thêm API vào bảng để cấu hình quyền.</p>
                        <form onSubmit={handleAddApi} className="space-y-3">
                            <div>
                                <label className="block text-sm font-bold mb-1">Tên chức năng</label>
                                <input required className="w-full border p-2 rounded" placeholder="VD: Xóa báo cáo"
                                    value={newApi.name} onChange={e => setNewApi({...newApi, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Endpoint (có thể dùng **)</label>
                                <input required className="w-full border p-2 rounded" placeholder="/api/reports/**"
                                    value={newApi.endpoint} onChange={e => setNewApi({...newApi, endpoint: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Method</label>
                                <select className="w-full border p-2 rounded" 
                                    value={newApi.method} onChange={e => setNewApi({...newApi, method: e.target.value})}>
                                    <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowApiModal(false)} className="px-3 py-1 text-gray-500">Hủy</button>
                                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Thêm vào bảng</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}