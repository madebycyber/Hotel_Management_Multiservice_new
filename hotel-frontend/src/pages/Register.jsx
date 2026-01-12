import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Hook để reset form nếu cần

    const onFinish = async (values) => {
        // Kiểm tra mật khẩu nhập lại
        if (values.password !== values.confirmPassword) {
            message.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            // Gọi API đăng ký
            // Payload gửi đi: { username, password, fullName }
            await axiosClient.post('/auth/register', {
                username: values.username,
                password: values.password,
                fullName: values.fullName
            });
            
            message.success("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login'); // Chuyển hướng về trang đăng nhập
        } catch (error) {
            // Lấy thông báo lỗi từ Backend trả về (nếu có)
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại! Username có thể đã tồn tại.";
            message.error(errorMsg);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' // Background màu tím xanh
        }}>
            <Card style={{ width: 450, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={3}>Đăng ký tài khoản</Title>
                    <p>Chào mừng bạn đến với hệ thống khách sạn</p>
                </div>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input prefix={<IdcardOutlined />} placeholder="Họ và tên đầy đủ" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                            { min: 4, message: 'Tên đăng nhập phải ít nhất 4 ký tự' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']} // Validate phụ thuộc vào field password
                        rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block style={{ fontWeight: 'bold' }}>
                            ĐĂNG KÝ NGAY
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        Đã có tài khoản? <Link to="/login" style={{ fontWeight: 'bold' }}>Đăng nhập ngay</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;