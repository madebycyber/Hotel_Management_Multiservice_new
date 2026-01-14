
export default function PaymentMockup({ amount, onConfirm }) {
    
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md p-8 rounded-[3rem] shadow-2xl text-center space-y-8 animate-scaleIn">
        <div>
          <h2 className="text-3xl font-black mb-2">Thanh toán</h2>
          <p className="text-gray-400 font-medium">Vui lòng quét mã QR để hoàn tất</p>
        </div>

        <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/20">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng tiền thanh toán</p>
          <p className="text-4xl font-black text-primary">{amount?.toLocaleString()}đ</p>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-[2rem] shadow-inner">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAY_BOOKING_${amount}`} 
              className="w-full h-full" alt="QR Code" />
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-200 active:scale-95"
          >
            TÔI ĐÃ CHUYỂN KHOẢN
          </button>
          <button className="w-full py-3 text-gray-400 font-bold hover:text-gray-600">
            Hủy giao dịch
          </button>
        </div>

        <div className="flex justify-center gap-4 grayscale opacity-30">
           <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" className="h-6" alt="VNPay" />
           <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" className="h-6" alt="Momo" />
        </div>
      </div>
    </div>
  );
}