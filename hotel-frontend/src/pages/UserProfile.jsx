import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { User, Shield, Briefcase } from 'lucide-react';

export default function UserProfile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        axiosClient.get('/api/auth/profile')
            .then(res => setProfile(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!profile) return <div className="p-8 text-center">Đang tải thông tin...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-3xl border border-gray-100">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User size={48} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">{profile.tenDayDu}</h1>
                    <p className="text-gray-500">@{profile.tenDangNhap}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold">
                        <Shield size={20} /> Vai trò hệ thống
                    </div>
                    <div className="text-xl font-bold text-gray-800 uppercase">{profile.tenVaiTro}</div>
                    <div className="text-sm text-gray-500 mt-1">Mã vai trò: {profile.maVaiTro}</div>
                </div>

                {profile.maKhachHang && (
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                        <div className="flex items-center gap-2 mb-4 text-green-600 font-bold">
                            <Briefcase size={20} /> Thông tin khách hàng
                        </div>
                        <div className="text-xl font-bold text-gray-800">{profile.maKhachHang}</div>
                        <div className="text-sm text-green-600 mt-2">
                            Tài khoản này đã được liên kết với dữ liệu đặt phòng.
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Quyền truy cập API:</h3>
                <div className="flex flex-wrap gap-2">
                    {profile.permissions.map((perm, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-xs font-mono text-gray-700">
                            {perm}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}