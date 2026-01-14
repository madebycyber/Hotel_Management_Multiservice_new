// src/pages/AuditLog.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { useFormatter } from '../hooks/useFormatter';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import axiosClient from '../api/axiosClient'; // Import Client

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { formatDate } = useFormatter();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // 1. GỌI API BACKEND (Lấy về mảng các chuỗi JWT)
      const res = await axiosClient.get('/api/admin/audit-logs');
      const encryptedLogs = res.data; // Mảng ["eyJh...", "eyJh..."]

      // 2. GIẢI MÃ TẠI FRONTEND
      const decodedLogs = encryptedLogs.map((token, index) => {
        try {
          const decoded = jwtDecode(token);
          return {
            id: decoded.id || index, // Nếu trong token không có id thì dùng index
            ...decoded, 
            rawToken: token
          };
        } catch (error) {
          console.error("Lỗi decode token:", token);
          return null;
        }
      }).filter(item => item !== null);

      setLogs(decodedLogs);
    } catch (error) {
      console.error("Lỗi tải nhật ký:", error);
      // alert("Không thể tải nhật ký hệ thống. Kiểm tra quyền truy cập.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      header: t('common.time') || 'Thời gian', 
      accessor: 'timestamp', 
      render: (row) => (
        <span className="text-gray-600 font-mono text-xs">
            {/* Format ngày giờ từ chuỗi ISO backend trả về */}
            {formatDate(row.timestamp)} {new Date(row.timestamp).toLocaleTimeString()}
        </span>
      ) 
    },
    // --- CỘT MỚI: DỊCH VỤ ---
    {
      header: 'Nguồn',
      accessor: 'serviceName',
      render: (row) => {
        let badgeColor = 'bg-gray-100 text-gray-600';
        // Xử lý null (nếu log cũ chưa có serviceName) -> mặc định là Identity
        const svc = row.serviceName || 'IDENTITY'; 

        if (svc.includes('BOOKING')) badgeColor = 'bg-purple-100 text-purple-700';
        if (svc.includes('ROOM')) badgeColor = 'bg-blue-100 text-blue-700';
        if (svc.includes('IDENTITY')) badgeColor = 'bg-gray-100 text-gray-700';

        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${badgeColor}`}>
                {svc.replace('-SERVICE', '')}
            </span>
        );
      }
    },
    { 
      header: t('users.username') || 'Người thực hiện', 
      accessor: 'user', 
      render: (row) => (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {(row.user || '?').charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-primary">{row.user}</span>
        </div>
      )
    },
    { 
      header: t('common.action') || 'Hành động', 
      accessor: 'action', 
      render: (row) => {
        let colorClass = 'bg-gray-100 text-gray-700';
        const act = (row.action || '').toUpperCase();
        if (act.includes('DELETE')) colorClass = 'bg-red-100 text-red-700';
        if (act.includes('CREATE')) colorClass = 'bg-green-100 text-green-700';
        if (act.includes('UPDATE')) colorClass = 'bg-yellow-100 text-yellow-800';
        
        return <span className={`px-2 py-1 rounded text-xs font-bold ${colorClass}`}>{row.action}</span>
      }
    },
    { 
      header: 'Chi tiết / Đối tượng', 
      accessor: 'target', 
      render: (row) => <code className="text-xs bg-gray-50 border p-1 rounded text-gray-600 truncate max-w-[200px] block" title={row.target}>{row.target}</code> 
    },
    {
       header: 'Secure Token',
       accessor: 'rawToken',
       render: (row) => (
           <div className="group relative">
               <ShieldCheckIcon className="w-5 h-5 text-green-600 cursor-help" />
               <div className="absolute right-0 top-full mt-1 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-xl hidden group-hover:block z-50 break-all">
                   {row.rawToken}
               </div>
           </div>
       )
    }
  ];

  return (
    <div className="space-y-6 dashboard-container p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-primary-dark dark:text-primary">
                    {t('settings.audit_log') || 'Nhật ký Hệ thống'}
                </h1>
                <p className="text-gray-500 text-sm">
                    Dữ liệu được lưu trữ và truyền tải dưới dạng JWT (JSON Web Token) để đảm bảo tính toàn vẹn.
                </p>
             </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={logs} loading={loading} />
      </div>
    </div>
  );
}