import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import UserRoomList from './UserRoomList';
import BookingFlow from './BookingFlow';
import PaymentMockup from './PaymentMockup';

export default function UserExperience() {
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [view, setView] = useState('list'); // list | booking | payment
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);

  // 1. Tải danh sách phòng trống
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resRooms, resServices] = await Promise.all([
          axiosClient.get('/api/rooms?size=100'),
          axiosClient.get('/api/dich-vu?size=100')
        ]);
        const availableRooms = resRooms.data.content.filter(r => r.trangThai === 'Trống');
        setRooms(availableRooms);
        setServices(resServices.data.content);
      } catch (e) { console.error("Lỗi tải dữ liệu", e); }
    };
    loadData();
  }, []);

  // 2. Xử lý khi User hoàn tất Form Đặt phòng
  const handleBookingComplete = async (formData) => {
    try {
      const payload = {
        tenKh: formData.tenKh,
        sdt: formData.sdt,
        email: formData.email,
        maPhong: selectedRoom.maPhong,
        ngayCheckIn: new Date(formData.checkIn).toISOString(),
        ngayCheckOut: new Date(formData.checkOut).toISOString(),
        services: formData.selectedServices 
      };

      // BƯỚC 1: Tạo Booking
      const resBooking = await axiosClient.post('/api/user/bookings/create', payload);
      const bookingData = resBooking.data;

      // BƯỚC 2: Gọi ngay API Invoice để lấy số tiền đã tính toán (Trigger DB chạy)
      // Lưu ý: Lúc này chưa thanh toán, chỉ lấy thông tin hóa đơn để hiện giá
      const resInvoice = await axiosClient.get(`/api/bookings/invoice/${bookingData.maDatPhong}`);
      
      // BƯỚC 3: Cập nhật state với thông tin booking + số tiền từ hóa đơn
      setCurrentBooking({
        ...bookingData,
        // Lấy soTienTT từ invoice đắp vào tongGia để PaymentMockup hiển thị đúng
        tongGia: resInvoice.data.soTienTT 
      });

      // BƯỚC 4: Chuyển màn hình
      setView('payment'); 
      
    } catch (e) {
      alert("Lỗi đặt phòng: " + (e.response?.data || e.message));
    }
  };

  const handlePaymentConfirm = async () => {
    try {
      // Ở bước này, thực tế có thể gọi API xác nhận thanh toán (POST /pay)
      // Nhưng nếu hệ thống của bạn dùng GET invoice để check lần cuối thì vẫn giữ nguyên
      const res = await axiosClient.get(`/api/bookings/invoice/${currentBooking.maDatPhong}`);
      
      // Có thể thêm logic gọi API update trạng thái Invoice thành 'Paid' nếu cần thiết
      // await axiosClient.post(`/api/invoices/${res.data.maHd}/pay`);

      alert(`Thanh toán thành công! Tổng tiền: ${res.data.soTienTT.toLocaleString()}đ`);
      window.location.reload(); 
    } catch (e) {
      const errorMsg = e.response?.data || "Lỗi xác nhận thanh toán";
      alert("Lỗi: " + errorMsg);
    }
  };

  return (
    <div className="space-y-6 pb-10 overflow-y-auto h-full p-2 sm:p-4">
      {/* Header đơn giản cho User */}
      <header className="bg-white dark:bg-gray-900 shadow p-4 mb-4 flex justify-between items-center">
         <h1 className="text-xl font-bold text-primary">Mambo Hotel Booking</h1>
         {view !== 'list' && (
             <button onClick={() => setView('list')} className="text-sm text-gray-500 hover:text-primary">
                 Quay về danh sách
             </button>
         )}
      </header>

      <div className="container mx-auto px-4 pb-8">
        {view === 'list' && (
            <UserRoomList 
            rooms={rooms} 
            onSelectRoom={(room) => {
                setSelectedRoom(room);
                setView('booking');
            }} 
            />
        )}

        {view === 'booking' && (
            <BookingFlow 
            room={selectedRoom} 
            services={services} 
            onComplete={handleBookingComplete} 
            />
        )}

        {view === 'payment' && (
            <PaymentMockup 
            // Lúc này currentBooking.tongGia đã có dữ liệu từ bước handleBookingComplete
            amount={currentBooking?.tongGia || 0} 
            onConfirm={handlePaymentConfirm} 
            />
        )}
      </div>
    </div>
  );
}