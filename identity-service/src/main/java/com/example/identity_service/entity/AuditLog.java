package com.example.identity_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // Người thực hiện
    private String action;   // Hành động (CREATE, DELETE...)
    private String target;   // Đối tượng bị tác động (VD: Phòng 101)
    
    private LocalDateTime timestamp;
    private String serviceName; 

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}