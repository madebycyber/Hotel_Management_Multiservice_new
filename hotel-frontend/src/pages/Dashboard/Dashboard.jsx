import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const stats = [
  { title: 'Tổng phòng', value: '248', change: '+12%', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/30' },
  { title: 'Đặt phòng hôm nay', value: '47', change: '+8%', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { title: 'Doanh thu tháng', value: '1.248tr', change: '+15%', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/30' },
  { title: 'Tỷ lệ lấp đầy', value: '87%', change: '-3%', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
];

const roomData = [
  { name: 'Đã đặt', value: 187, color: '#0F766E' },
  { name: 'Trống', value: 61, color: '#D1D5DB' },
];

export default function Dashboard() {
  return (
    // Thêm overflow-y-auto và h-full ở đây để đảm bảo cuộn được
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
            <h1 className="text-lg font-semibold mb-4">
                Dashboard Quản lý
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Chào mừng trở lại, quản trị viên!</p>
        </div>
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium">
          Tháng 1, 2026
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 ${stat.bg}`}
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{stat.title}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            <p className={`mt-2 text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
              {stat.change} <span className="text-gray-500 font-normal">so với tuần trước</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Tình trạng phòng</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roomData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">Doanh thu theo ngày</h3>
            <div className="h-64 bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-gray-400 italic">Dữ liệu biểu đồ đang được tải...</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Lịch Check-in/out</h3>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
               <p className="text-teal-700 dark:text-teal-400 font-bold">Hôm nay - 13/01/2026</p>
               <p className="text-sm mt-1">12 lượt Check-in | 8 lượt Check-out</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Thông báo</h3>
            <div className="space-y-4">
               {[1, 2].map((item) => (
                  <div key={item} className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">L</div>
                    <div>
                        <p className="text-sm font-bold">Lễ tân</p>
                        <p className="text-xs text-gray-500">Phòng 108 yêu cầu dọn dẹp sớm...</p>
                    </div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}