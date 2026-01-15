import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, User, Phone, Mail, CreditCard } from 'lucide-react';

export default function BookingFlow({ room, services, onComplete }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    tenKh: '', sdt: '', email: '',
    checkIn: '', checkOut: '',
    selectedServices: []
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const calculateEstimate = () => {
  const roomPrice = room.loaiPhong?.gia || 0;
  const checkIn = new Date(bookingData.checkIn);
  const checkOut = new Date(bookingData.checkOut);
  
  let days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  if (days <= 0) days = 1;

  const serviceTotal = bookingData.selectedServices.reduce((sum, item) => {
    const serviceInfo = services.find(s => s.maDichVu === item.maDichVu);
    return sum + (serviceInfo?.giaTien || 0) * item.soLuong;
  }, 0);

  return (roomPrice * days) + serviceTotal;
};

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[500px]">
      {/* Stepper Header */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= i ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > i ? <CheckCircle2 size={20} /> : i}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex items-center gap-4 mb-4">
             <button onClick={() => window.history.back()}><ArrowLeft/></button>
             <h2 className="text-2xl font-black">Chi tiết phòng {room.soPhong}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <img src={`http://localhost:8081${room.image}`} className="rounded-3xl h-64 w-full object-cover" />
            <div className="space-y-4">
              <p className="text-gray-500 leading-relaxed">{room.moTa || 'Phòng nghỉ sang trọng đầy đủ tiện nghi với tầm nhìn đẹp...'}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Ngày đến</label>
                  <input type="date" className="text-gray-600 dark:text-gray-400" 
                    onChange={e => setBookingData({...bookingData, checkIn: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Ngày đi</label>
                  <input type="date" className="text-gray-600 dark:text-gray-400" 
                    onChange={e => setBookingData({...bookingData, checkOut: e.target.value})}/>
                </div>
              </div>
              <button onClick={handleNext} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/25">TIẾP TỤC</button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <h2 className="text-2xl font-black text-center">Nâng cấp trải nghiệm</h2>
          <div className="grid gap-4">
            {services.map(s => {
            // Tìm xem dịch vụ này đã được chọn chưa
            const selected = bookingData.selectedServices.find(item => item.maDichVu === s.maDichVu);

            return (
                <div key={s.maDichVu} className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${selected ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <CreditCard />
                    </div>
                    <div>
                    <h4 className="font-bold text-gray-800">{s.tenDichVu}</h4>
                    <p className="text-sm text-primary font-medium">{s.giaTien.toLocaleString()}đ</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {selected && (
                    <div className="flex items-center bg-white border rounded-lg overflow-hidden shadow-sm">
                        <button 
                        className="px-3 py-1 hover:bg-gray-100 font-bold"
                        onClick={() => {
                            const newQty = Math.max(1, selected.soLuong - 1);
                            setBookingData({
                            ...bookingData,
                            selectedServices: bookingData.selectedServices.map(item => 
                                item.maDichVu === s.maDichVu ? { ...item, soLuong: newQty } : item
                            )
                            });
                        }}
                        >-</button>
                        <span className="px-3 font-bold text-primary">{selected.soLuong}</span>
                        <button 
                        className="px-3 py-1 hover:bg-gray-100 font-bold"
                        onClick={() => {
                            setBookingData({
                            ...bookingData,
                            selectedServices: bookingData.selectedServices.map(item => 
                                item.maDichVu === s.maDichVu ? { ...item, soLuong: item.soLuong + 1 } : item
                            )
                            });
                        }}
                        >+</button>
                    </div>
                    )}
                    
                    <input 
                    type="checkbox" 
                    className="w-6 h-6 rounded-full accent-primary cursor-pointer"
                    checked={!!selected}
                    onChange={(e) => {
                        if (e.target.checked) {
                        setBookingData({
                            ...bookingData, 
                            selectedServices: [...bookingData.selectedServices, { maDichVu: s.maDichVu, soLuong: 1 }]
                        });
                        } else {
                        setBookingData({
                            ...bookingData,
                            selectedServices: bookingData.selectedServices.filter(item => item.maDichVu !== s.maDichVu)
                        });
                        }
                    }}
                    />
                </div>
                </div>
            );
            })}
          </div>
          <div className="flex gap-4">
            <button onClick={handleBack} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold">Quay lại</button>
            <button onClick={handleNext} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/25">XÁC NHẬN DỊCH VỤ</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <h2 className="text-2xl font-black text-center">Thông tin đặt chỗ</h2>
          <div className="space-y-4">
             <div className="relative">
                <User className="absolute left-4 top-4 text-gray-400" size={20}/>
                <input className="text-gray-600 dark:text-gray-400" placeholder="Họ và tên khách hàng" 
                   onChange={e => setBookingData({...bookingData, tenKh: e.target.value})}/>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-400" size={20}/>
                  <input className="text-gray-600 dark:text-gray-400" placeholder="Số điện thoại"
                    onChange={e => setBookingData({...bookingData, sdt: e.target.value})}/>
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400" size={20}/>
                  <input className="text-gray-600 dark:text-gray-400" placeholder="Email (nếu có)"
                    onChange={e => setBookingData({...bookingData, email: e.target.value})}/>
                </div>
             </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-700 text-sm italic">
            * Nếu bạn đã từng đặt phòng, chúng tôi sẽ tự động sử dụng lại thông tin cũ dựa trên tên và số điện thoại.
          </div>
            <div className="text-xl font-black text-primary">
            Tổng thanh toán tạm tính: {calculateEstimate().toLocaleString()}đ
            </div>
          <button onClick={() => onComplete(bookingData)} className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-200">HOÀN TẤT ĐẶT PHÒNG</button>
        </div>
      )}
    </div>
  );
}