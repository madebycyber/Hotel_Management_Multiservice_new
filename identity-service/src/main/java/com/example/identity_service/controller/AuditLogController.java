package com.example.identity_service.controller;

import com.example.identity_service.dto.LogDTO;
import com.example.identity_service.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    // =================================================================
    // 1. API CHO FRONTEND (Admin xem log)
    // =================================================================
    @GetMapping("/api/admin/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        // Lấy tất cả log từ DB, mã hóa thành danh sách JWT và trả về
        return ResponseEntity.ok(auditLogService.getAllEncryptedLogs());
    }

    // =================================================================
    // 2. API CHO MICROSERVICES (Room/Booking gửi log sang)
    // =================================================================
    @PostMapping("/api/internal/logs")
    public ResponseEntity<?> receiveInternalLog(@RequestBody LogDTO logDTO) {
        // Lưu log nhận được vào DB
        auditLogService.logAction(
            logDTO.getUser(), 
            logDTO.getAction(), 
            logDTO.getTarget(), 
            logDTO.getServiceName() // VD: "ROOM-SERVICE"
        );
        return ResponseEntity.ok("Log received");
    }
}