package com.example.booking_service.repository;

import com.example.booking_service.dto.RevenueDTO;
import com.example.booking_service.entity.HoaDonThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonThanhToan, String> {

    // SỬA: Đảm bảo có @Query này
    @Query("SELECT new com.example.booking_service.dto.RevenueDTO(" +
           "TO_CHAR(h.ngayTT, 'YYYY-MM'), SUM(h.soTienTT)) " +
           "FROM HoaDonThanhToan h " +
           "WHERE h.trangThaiTT = 'Đã thanh toán' " + 
           "GROUP BY TO_CHAR(h.ngayTT, 'YYYY-MM') " +
           "ORDER BY TO_CHAR(h.ngayTT, 'YYYY-MM') ASC")
    List<RevenueDTO> getMonthlyRevenue(); 
    // Lưu ý tên hàm là getMonthlyRevenue, KHÔNG PHẢI fetchRevenueStats
}