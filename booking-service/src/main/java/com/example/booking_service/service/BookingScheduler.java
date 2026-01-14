package com.example.booking_service.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingScheduler {

    @Autowired private JdbcTemplate jdbcTemplate;

    // Chạy mỗi 5 phút một lần để đồng bộ trạng thái
    @Scheduled(fixedRate = 300000) 
    @Transactional
    public void autoUpdateRoomStatus() {
        // 1. Quét các booking đã quá hạn checkout -> chuyển thành Nợ thanh toán
        String sqlUpdateOverdue = """
            UPDATE phieudatphong 
            SET trangthaidatphong = 'Nợ thanh toán'
            WHERE ngaycheckout < NOW() 
              AND trangthaidatphong = 'Đã đặt'
        """;
        jdbcTemplate.update(sqlUpdateOverdue);

        // 2. Cập nhật trạng thái 'Đang sử dụng' cho các phòng đến giờ Check-in
        String sqlUpdateOccupied = """
            UPDATE phong p
            SET trangthai = 'Đang sử dụng'
            WHERE EXISTS (
                SELECT 1 FROM phieudatphong pdp
                WHERE pdp.maphong = p.maphong
                  AND pdp.ngaycheckin <= NOW()
                  AND pdp.ngaycheckout > NOW()
                  AND pdp.trangthaidatphong = 'Đã đặt'
            ) AND p.trangthai != 'Đang sử dụng'
        """;
        jdbcTemplate.update(sqlUpdateOccupied);
        
        // 3. Cập nhật trạng thái 'Trống' cho các phòng đã hết hạn booking
        String sqlUpdateAvailable = """
            UPDATE phong p
            SET trangthai = 'Trống'
            WHERE NOT EXISTS (
                SELECT 1 FROM phieudatphong pdp
                WHERE pdp.maphong = p.maphong
                  AND pdp.ngaycheckin <= NOW()
                  AND pdp.ngaycheckout > NOW()
            ) AND p.trangthai = 'Đang sử dụng'
        """;
        jdbcTemplate.update(sqlUpdateAvailable);
        
        System.out.println("🔄 Đã đồng bộ trạng thái phòng theo thời gian thực.");
    }
}