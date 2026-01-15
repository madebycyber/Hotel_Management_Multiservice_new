import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import axiosClient from '../api/axiosClient';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Gọi API lấy dịch vụ
    // Cần đảm bảo Gateway đã map /api/dich-vu tới room-service
    axiosClient.get('/api/dich-vu')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  const columns = [
    { header: 'Mã DV', accessor: 'maDichVu' },
    { header: 'Tên Dịch Vụ', accessor: 'tenDichVu' },
    { header: 'Đơn giá', accessor: 'donGia', render: (row) => row.donGia?.toLocaleString() + ' VNĐ' },
  ];

  return (
    <div className="space-y-6 dashboard-container h-full overflow-y-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dịch Vụ Khách Sạn</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={services} />
      </div>
    </div>
  );
}