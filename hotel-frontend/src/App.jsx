import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LogoutButton from './components/LogoutButton';

// Component bảo vệ: Nếu chưa login thì đá về trang Login
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const Dashboard = () => (
    <div style={{ padding: 50 }}>
        <h1>Chào mừng đến với Hotel Admin</h1>
        <LogoutButton />
        {/* Nội dung Dashboard ở đây */}
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Các route cần bảo mật */}
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                
                {/* Mặc định vào dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;