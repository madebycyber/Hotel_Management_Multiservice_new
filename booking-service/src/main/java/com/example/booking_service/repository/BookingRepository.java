package com.example.booking_service.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.example.booking_service.entity.PhieuDatPhong;
import com.example.booking_service.dto.RevenueDTO;

@Repository
public interface BookingRepository extends JpaRepository<PhieuDatPhong, String> {
    
    // Query tính tổng doanh thu theo tháng (PostgreSQL syntax)
    @Query("SELECT new com.example.booking_service.dto.RevenueDTO(TO_CHAR(b.ngayCheckOut, 'YYYY-MM'), SUM(b.tongGia)) " +
           "FROM PhieuDatPhong b " +
           "WHERE b.trangThai = 'Đã đặt' " +
           "GROUP BY TO_CHAR(b.ngayCheckOut, 'YYYY-MM')")
    List<RevenueDTO> getMonthlyRevenue();
}
