package com.example.booking_service.repository;

import com.example.booking_service.entity.PhieuDatPhong;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
public interface PhieuDatPhongRepository extends JpaRepository<PhieuDatPhong, String> {
       // ^^^^^^ <--- Phải là INTERFACE, không được là CLASS
       List<PhieuDatPhong> findByKhachHang_MaKh(String maKhachHang);

       List<PhieuDatPhong> findByKhachHang_SdtOrderByNgayCheckInDesc(String sdt);
}