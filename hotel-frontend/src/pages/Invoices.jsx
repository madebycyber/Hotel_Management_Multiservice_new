// src/pages/Invoices.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/Shared/DataTable';
import Pagination from '../components/Shared/Pagination'; // <--- Import mới
import axiosClient from '../api/axiosClient';

export default function Invoices() {
  // ... (Giữ nguyên các state và hàm fetchInvoices cũ của bạn) ...
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  const fetchInvoices = async (page) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/invoices?page=${page - 1}&size=10`);
      setInvoices(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error("Lỗi tải hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... (Giữ nguyên const columns) ...
  const columns = [ 
      // ... code cột cũ của bạn ...
      { header: 'Mã HĐ', accessor: 'maHd', render: (row) => <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{row.maHd}</span> },
      { header: 'Booking', accessor: 'phieuDatPhong', render: (row) => <span className="text-primary font-medium">#{row.phieuDatPhong?.maDatPhong}</span> },
      { header: 'Ngày TT', accessor: 'ngayTT', render: (row) => new Date(row.ngayTT).toLocaleString('vi-VN') },
      { header: 'Hình Thức', accessor: 'hinhThucTT' },
      { header: 'Số Tiền', accessor: 'soTienTT', render: (row) => <span className="text-lg font-bold text-green-600">{row.soTienTT?.toLocaleString()} đ</span> },
      { header: 'NV Thực hiện', accessor: 'maNV' },
      { header: 'Trạng Thái', accessor: 'trangThaiTT', render: (row) => (<span className={`px-2 py-1 rounded text-xs font-bold ${row.trangThaiTT === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{row.trangThaiTT}</span>) }
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">

       <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Lịch sử Thanh toán</h1>
          <p className="text-gray-600 dark:text-gray-400">Tổng số: {totalElements} hóa đơn</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={invoices} loading={loading} />
        

        <div className="mt-4 border-t pt-4 border-gray-100 dark:border-gray-700">
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />
        </div>
      </div>
    </div>
  );
}