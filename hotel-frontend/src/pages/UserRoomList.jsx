import React, { useState } from 'react';
import { Search, BedDouble, Users, Maximize, Star } from 'lucide-react';

export default function UserRoomList({ rooms, onSelectRoom }) {
  const [filter, setFilter] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

const filteredRooms = rooms.filter(room => {
    // Kiểm tra hạng phòng
    const matchType = filter === 'Tất cả' || room.loaiPhong?.tenLoaiPhong === filter;

    // Ép kiểu soPhong về String bằng cách dùng String() hoặc template literal
    const soPhongStr = String(room.soPhong || ""); 
    
    const matchSearch = soPhongStr.includes(searchTerm) || 
                        room.loaiPhong?.tenLoaiPhong?.toLowerCase().includes(searchTerm.toLowerCase());
                        
    return matchType && matchSearch;
});

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[500px]">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-2.5 text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-primary transition-all" 
            placeholder="Bạn muốn tìm phòng nào?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['Tất cả', 'Phòng Đơn', 'Phòng Đôi', 'Vip'].map(tag => (
            <button 
              key={tag} 
              onClick={() => setFilter(tag)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                filter === tag ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredRooms.map((room) => (
          <div key={room.maPhong} className="group bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={room.image ? `http://localhost:8081${room.image}` : 'https://placehold.co/600x400?text=Hotel+Room'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={room.soPhong}
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-black text-primary uppercase tracking-tighter shadow-sm">
                {room.loaiPhong?.tenLoaiPhong}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-xl text-gray-900 dark:text-white">Phòng {room.soPhong}</h3>
                  <div className="flex items-center gap-1 text-amber-500 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor"/>)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-gray-500 dark:text-gray-400 text-xs font-medium">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                  <BedDouble size={14} className="text-primary"/> 1 Giường lớn
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                  <Maximize size={14} className="text-primary"/> 35 m²
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center border-t border-gray-50 dark:border-gray-700">
                <div>
                  <span className="text-2xl font-black text-primary">{room.loaiPhong?.gia?.toLocaleString()}đ</span>
                  <span className="text-gray-400 text-[10px] block font-bold">MỖI ĐÊM</span>
                </div>
                <button 
                  onClick={() => onSelectRoom(room)}
                  className="bg-primary text-white p-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 group-hover:px-6"
                >
                  <span className="font-bold">Đặt ngay</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}