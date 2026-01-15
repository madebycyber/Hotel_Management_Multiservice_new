// src/components/Layout/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon, // hamburger
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', icon: BuildingOffice2Icon, path: '/dashboard' },
  { name: 'Phòng', icon: BuildingOffice2Icon, path: '/rooms' },
  { name: 'Loại phòng', icon: CalendarIcon, path: '/room-types' },
  { name: 'Đặt phòng', icon: CalendarIcon, path: '/bookings' },
  { name: 'Đặt dịch vụ', icon: CalendarIcon, path: '/services' },
  { name: 'Dịch vụ', icon: CalendarIcon, path: '/dich-vu' },
  { name: 'Khách hàng', icon: UsersIcon, path: '/customers' },
  { name: 'Hóa đơn', icon: CurrencyDollarIcon, path: '/invoices' },
  { name: 'Cài đặt', icon: Cog6ToothIcon, path: '/settings' },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop default mở
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default');
  const navigate = useNavigate();
  // Trong DashboardLayout.jsx
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
 });
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

    useEffect(() => {
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    }, [theme]);



  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:block bg-primary-dark text-white transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary/30">
          {sidebarOpen && (
            <h1 className="text-xl font-bold tracking-tight">HotelHub</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-primary"
          >
            {sidebarOpen ? <Bars3Icon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-primary/80 hover:text-white'
                }`
              }
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-primary/30">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-red-700/50 rounded-lg"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            {sidebarOpen && <span className="ml-3">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (overlay) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute top-0 left-0 h-full w-64 bg-primary-dark text-white shadow-xl transform transition-transform duration-300">
            {/* Nội dung sidebar giống desktop */}
            <div className="p-4 border-b border-primary/30">
              <h1 className="text-xl font-bold">HotelHub</h1>
            </div>
            <nav className="mt-6 px-3 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg ${
                      isActive ? 'bg-primary' : 'hover:bg-primary/80'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between relative z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-gray-600 dark:text-gray-300"
            >
              <Bars3Icon className="w-8 h-8" />
            </button>
            <h2 className="text-xl font-semibold text-primary-dark dark:text-primary">
              Dashboard Quản lý
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Theme Selector Dropdown - ĐÃ SỬA LỖI */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></div>
                <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                  {theme.replace('-', ' ')}
                </span>
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 
                              invisible opacity-0 group-hover:visible group-hover:opacity-100 
                              transition-all duration-200 transform origin-top-right z-50
                              before:content-[''] before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:bg-transparent">
                {/* Giải thích fix:
                   1. top-full: Căn menu ngay dưới đáy của cha.
                   2. invisible/visible: Tránh click nhầm khi ẩn.
                   3. before:... : Tạo một lớp trong suốt cao 4 unit ở phía trên menu để lấp khoảng trống margin, giúp chuột không bị mất focus khi rê xuống.
                */}
                <div className="py-2 max-h-[80vh] overflow-y-auto">
                  {[
                    { name: 'default', label: 'Teal Luxury', color: '#0F766E' },
                    { name: 'navy', label: 'Navy Elegant', color: '#1E40AF' },
                    { name: 'earth', label: 'Warm Earth', color: '#8B5E3C' },
                    { name: 'lavender', label: 'Lavender Sophisticated', color: '#7C3AED' },
                    { name: 'emerald-dark', label: 'Emerald Dark', color: '#059669' },
                  ].map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTheme(t.name)}
                      className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                        theme === t.name ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full mr-3 border border-gray-200 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: t.color }}
                      ></div>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {t.label}
                      </span>
                      {theme === t.name && (
                        <span className="ml-auto text-primary font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l pl-4 border-gray-300 dark:border-gray-600">
                 <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    A
                 </div>
                 <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">{children}</main>
      </div>
    </div>
  );
}