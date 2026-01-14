package com.example.room_service.repository;

import com.example.room_service.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Sắp xếp log mới nhất lên đầu
    List<AuditLog> findAllByOrderByTimestampDesc();
}