package com.example.room_service.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.room_service.entity.Phong;

@Repository
public interface PhongRepository extends JpaRepository<Phong, String> {
    // Đếm số phòng theo trạng thái (cho Dashboard)
    long countByTrangThai(String trangThai);

    List<Phong> findByLoaiPhong_MaLoaiPhong(String loaiPhongId);
}

