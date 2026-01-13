// src/pages/Dashboard.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


const stats = [
  { title: 'Tổng phòng', value: '248', change: '+12%', color: 'text-primary', bg: 'bg-teal-50 dark:bg-teal-950/30' },
  { title: 'Đặt phòng hôm nay', value: '47', change: '+8%', color: 'text-accent', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { title: 'Doanh thu tháng', value: '1.248tr', change: '+15%', color: 'text-primary', bg: 'bg-teal-50 dark:bg-teal-950/30' },
  { title: 'Tỷ lệ lấp đầy', value: '87%', change: '-3%', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
];

const roomData = [
  { name: 'Đã đặt', value: 187, color: '#d3dddc' },
  { name: 'Trống', value: 61, color: '#D1D5DB' },
];

export default function Dashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-primary">
          Dashboard Quản lý Khách sạn
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tháng 1, 2026
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 ${stat.bg}`}
          >
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{stat.title}</h3>
            <p className={`text-4xl font-bold mt-3 ${stat.color}`}>{stat.value}</p>
            <p className={`mt-2 text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} so với tuần trước
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tình trạng phòng - Donut Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-primary-dark dark:text-primary">
              Tình trạng phòng
            </h3>
            <div className="h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roomData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {roomData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Doanh thu theo ngày - Placeholder (thêm BarChart sau) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-primary-dark dark:text-primary">
              Doanh thu theo ngày
            </h3>
            <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Thêm BarChart Recharts ở đây</p>
            </div>
          </div>
        </div>

        {/* Right: Agenda + Messages */}
        <div className="space-y-8">
          {/* Lịch check-in/out */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-primary-dark dark:text-primary">
              Lịch check-in/out
            </h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              <div className="font-bold text-gray-500 dark:text-gray-400">T2</div>
              {/* ... thêm ngày khác, hoặc dùng react-calendar */}
              <div className="col-span-7 mt-4 text-left">
                <p className="font-medium">T2 - 14/01/2026</p>
              </div>
            </div>
          </div>

          {/* Booking sắp tới */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-primary-dark dark:text-primary">
              Booking sắp tới
            </h3>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="font-medium">Phòng 205 - Check-in 14:00</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Khách: Nguyễn Văn A</p>
                </div>
              </div>
              {/* Thêm item khác */}
            </div>
          </div>

          {/* Thông báo */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-primary-dark dark:text-primary">
              Thông báo
            </h3>
            <div className="spacbg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700e-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                  L
                </div>
                <div>
                  <p className="font-medium">Lễ tân</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phòng 108 yêu cầu dọn dẹp sớm
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10 phút trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}