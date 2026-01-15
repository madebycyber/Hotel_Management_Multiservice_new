// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard'; // hoặc Dashboard.jsx tùy tên file
import Rooms from './pages/Rooms';           // ví dụ trang Phòng
import Bookings from './pages/Bookings';     // ví dụ trang Đặt phòng
import Customers from './pages/Customers';   // ví dụ trang Khách hàng
import Invoices from './pages/Invoices';     // ví dụ trang Hóa đơn
import Settings from './pages/Settings';     // ví dụ trang Cài đặt
import Services from './pages/Services';
import LoaiPhong from './pages/LoaiPhong';

import DashboardLayout from './components/Layout/DashboardLayout';

// PrivateRoute: chỉ cho phép truy cập nếu đã login (có token)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang công khai - không dùng layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tất cả các trang bảo vệ đều dùng DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Rooms />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/room-types"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <LoaiPhong />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Bookings />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Customers />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/invoices"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Invoices />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/services"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Services />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Redirect mặc định */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;