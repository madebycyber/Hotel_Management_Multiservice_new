package com.example.booking_service.controller;

import com.example.booking_service.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<?> getAuditLogs() {
        // Trả về danh sách String (các token JWT)
        return ResponseEntity.ok(auditLogService.getAllEncryptedLogs());
    }
}