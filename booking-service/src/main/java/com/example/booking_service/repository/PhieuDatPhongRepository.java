package com.example.booking_service.repository;

import com.example.booking_service.entity.PhieuDatPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
public interface PhieuDatPhongRepository extends JpaRepository<PhieuDatPhong, String> {
       // ^^^^^^ <--- Phải là INTERFACE, không được là CLASS
}