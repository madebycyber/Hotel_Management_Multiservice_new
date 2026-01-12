import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Xóa token
        localStorage.removeItem('token');
        // 2. Chuyển về trang login
        navigate('/login');
    };

    return (
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
        </Button>
    );
};

export default LogoutButton;