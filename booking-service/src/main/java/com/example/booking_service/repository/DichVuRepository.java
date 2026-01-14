package com.example.booking_service.repository;

import com.example.booking_service.entity.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu, String> {
    // JpaRepository đã có sẵn findById
}