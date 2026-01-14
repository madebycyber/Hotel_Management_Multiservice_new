import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import axiosClient from '../../api/axiosClient';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // 1. State cho Thống kê số liệu (Cards)
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    bookingsToday: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });

  // 2. State cho Biểu đồ tròn (Phòng)
  const [roomPieData, setRoomPieData] = useState([]);

  // 3. State cho Biểu đồ cột (Doanh thu)
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Gọi song song 3 API để tối ưu tốc độ
      const [resRoomStats, resRevenue, resBookings] = await Promise.all([
        axiosClient.get('/api/rooms/stats'),       // API: { Available: 10, Occupied: 5, Total: 15 }
        axiosClient.get('/api/invoices/revenue'),  // API: [{ month: '2026-01', revenue: 5000000 }]
        axiosClient.get('/api/bookings?page=0&size=100') // Lấy danh sách booking để đếm check-in hôm nay
      ]);

      // --- XỬ LÝ DỮ LIỆU ---

      // 1. Dữ liệu Phòng
      const rStats = resRoomStats.data; // { Available: 20, Occupied: 5, Maintenance: 2, Total: 27 }
      const occupancy = rStats.Total > 0 ? ((rStats.Occupied / rStats.Total) * 100).toFixed(1) : 0;

      // 2. Dữ liệu Đặt phòng hôm nay
      const todayStr = new Date().toISOString().slice(0, 10);
      const bookingsTodayCount = resBookings.data.content.filter(b => 
          b.ngayCheckIn && b.ngayCheckIn.startsWith(todayStr)
      ).length;

      // 3. Dữ liệu Doanh thu (Lấy tháng hiện tại)
      const currentMonthStr = todayStr.slice(0, 7); // "2026-01"
      const currentMonthRevenue = resRevenue.data.find(r => r.month === currentMonthStr)?.revenue || 0;

      // Cập nhật State Stats
      setStats({
        totalRooms: rStats.Total || 0,
        occupiedRooms: rStats.Occupied || 0,
        availableRooms: rStats.Available || 0,
        bookingsToday: bookingsTodayCount,
        monthlyRevenue: currentMonthRevenue,
        occupancyRate: occupancy
      });

      // Cập nhật Biểu đồ tròn
      setRoomPieData([
        { name: 'Đang sử dụng', value: rStats.Occupied || 0, color: '#0F766E' }, // Teal
        { name: 'Trống', value: rStats.Available || 0, color: '#D1D5DB' }, // Gray
        { name: 'Bảo trì', value: rStats.Maintenance || 0, color: '#F59E0B' } // Amber
      ]);

      // Cập nhật Biểu đồ cột Doanh thu
      // Map data từ API RevenueDTO sang format của Recharts
      const chartData = resRevenue.data.map(item => ({
          name: item.month, // "2026-01"
          total: item.revenue
      }));
      setRevenueData(chartData);

    } catch (error) {
      console.error("Lỗi tải Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa màu sắc hiển thị cho cards
  const statsCards = [
    { 
        title: 'Tổng phòng', 
        value: stats.totalRooms, 
        desc: `${stats.availableRooms} phòng trống`, 
        color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' 
    },
    { 
        title: 'Đặt phòng hôm nay', 
        value: stats.bookingsToday, 
        desc: 'Lượt check-in mới', 
        color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' 
    },
    { 
        title: 'Doanh thu tháng', 
        value: `${(stats.monthlyRevenue / 1000000).toLocaleString()} Tr`, 
        desc: 'VNĐ (Thực thu)', 
        color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' 
    },
    { 
        title: 'Tỷ lệ lấp đầy', 
        value: `${stats.occupancyRate}%`, 
        desc: 'Công suất phòng', 
        color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' 
    },
  ];

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
            <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">Dashboard Quản lý</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Cập nhật lúc: {new Date().toLocaleString('vi-VN')}</p>
        </div>
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium dark:text-white">
          Tháng {new Date().getMonth() + 1}, {new Date().getFullYear()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 ${stat.bg}`}>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-500 uppercase tracking-wider">{stat.title}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{loading ? '...' : stat.value}</p>
            <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Biểu đồ */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Biểu đồ Tròn: Tình trạng phòng */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-400">Tình trạng phòng hiện tại</h3>
            <div className="h-80 w-full">
              {loading ? (
                  <div className="h-full flex items-center justify-center text-gray-400">Đang tải dữ liệu...</div>
              ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roomPieData}
                        cx="50%" cy="50%"
                        innerRadius={80} outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {roomPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Biểu đồ Cột: Doanh thu */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 dark:text-gray-400">Biểu đồ Doanh thu (6 tháng gần nhất)</h3>
            <div className="h-80 w-full">
               {loading || revenueData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900 rounded">
                      {revenueData.length === 0 ? "Chưa có dữ liệu doanh thu" : "Đang tải..."}
                  </div>
               ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value/1000000}M`} />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                      <Bar dataKey="total" fill="#0F766E" radius={[4, 4, 0, 0]} name="Doanh thu" />
                    </BarChart>
                  </ResponsiveContainer>
               )}
            </div>
          </div>
        </div>

        {/* Right Column - Thông báo & Lịch */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-400">Hôm nay</h3>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800 text-center">
               <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">
                   {stats.bookingsToday}
               </p>
               <p className="text-sm text-teal-600 dark:text-teal-500 mt-1">Lượt Check-in dự kiến</p>
            </div>
            
            <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm border-b pb-2 dark:border-gray-700 dark:text-gray-500">
                    <span>Phòng trống</span>
                    <span className="font-bold">{stats.availableRooms}</span>
                </div>
                <div className="flex justify-between text-sm border-b pb-2 dark:border-gray-700 dark:text-gray-500">
                    <span>Đang ở</span>
                    <span className="font-bold">{stats.occupiedRooms}</span>
                </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-500">Hoạt động gần đây</h3>
            <div className="space-y-4">
               {/* Phần này có thể gọi API log hệ thống nếu có, tạm thời hardcode demo UI */}
               <div className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">SYS</div>
                 <div>
                     <p className="text-sm font-bold dark:text-gray-400">Hệ thống</p>
                     <p className="text-xs text-gray-500">Đồng bộ dữ liệu hoàn tất</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}