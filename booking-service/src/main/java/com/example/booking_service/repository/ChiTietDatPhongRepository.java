package com.example.booking_service.repository;

import com.example.booking_service.entity.ChiTietDatPhong;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
// SỬA: Đổi PhieuDatPhong -> ChiTietDatPhong
public interface ChiTietDatPhongRepository extends JpaRepository<ChiTietDatPhong, String> {
    // Không cần khai báo hàm save, JpaRepository đã có sẵn
    List<ChiTietDatPhong> findByMaDatPhong(String maDatPhong);
}