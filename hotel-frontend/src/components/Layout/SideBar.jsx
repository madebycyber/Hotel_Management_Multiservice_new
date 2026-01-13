// src/components/Layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { BuildingOffice2Icon, CalendarIcon, CurrencyDollarIcon, UsersIcon, InboxIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', icon: BuildingOffice2Icon, path: '/' },
  { name: 'Phòng', icon: UsersIcon, path: '/rooms' },
  { name: 'Đặt phòng', icon: CalendarIcon, path: '/bookings' },
  { name: 'Khách hàng', icon: UsersIcon, path: '/customers' },
  { name: 'Hóa đơn', icon: CurrencyDollarIcon, path: '/invoices' },
  { name: 'Dịch vụ', icon: InboxIcon, path: '/services' },
  { name: 'Khuyến mãi', icon: CurrencyDollarIcon, path: '/promotions' },
  { name: 'Nhân viên', icon: UsersIcon, path: '/staff' },
  { name: 'Cài đặt', icon: Cog6ToothIcon, path: '/settings' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div className={`bg-primaryDark text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center justify-between">
        <h1 className={`${isOpen ? 'block' : 'hidden'} text-xl font-bold`}>HotelHub</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          {/* icon hamburger */}
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${isActive ? 'bg-primary' : 'hover:bg-primary/80'}`
            }
          >
            <item.icon className="w-6 h-6 mr-3" />
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}