import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            // Gọi API Login
            // Lưu ý: Backend trả về chuỗi Token trực tiếp (String)
            const response = await axiosClient.post('/auth/login', values);
            
            // Lưu token vào LocalStorage
            localStorage.setItem('token', response.data);
            
            message.success("Đăng nhập thành công!");
            navigate('/dashboard'); // Chuyển hướng sang trang chính
        } catch (error) {
            message.error("Đăng nhập thất bại! Kiểm tra lại tài khoản.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="Đăng nhập hệ thống" style={{ width: 400 }}>
                <Form name="login" onFinish={onFinish}>
                    <Form.Item name="username" rules={[{ required: true, message: 'Nhập Username!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Nhập Password!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;