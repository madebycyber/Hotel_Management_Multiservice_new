package com.example.identity_service.service;

import com.example.identity_service.entity.AuditLog;
import com.example.identity_service.repository.AuditLogRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepo;

    // Dùng chung Key với JwtService
    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    // --- 1. HÀM LƯU LOG (Dùng cho cả nội bộ Identity và nhận từ Service khác) ---
    public void logAction(String username, String action, String target, String serviceName) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setTarget(target);
        log.setServiceName(serviceName); // Lưu tên service nguồn (VD: ROOM, BOOKING)
        auditLogRepo.save(log);
    }

    // --- 2. HÀM LẤY LOG & MÃ HÓA (Trả về cho Frontend) ---
    public List<String> getAllEncryptedLogs() {
        // Lấy list log mới nhất từ DB
        List<AuditLog> logs = auditLogRepo.findAllByOrderByTimestampDesc();

        // Biến đổi từng dòng log -> JWT Token
        return logs.stream().map(this::convertLogToJwt).collect(Collectors.toList());
    }

    // Helper: Tạo JWT từ Entity
    private String convertLogToJwt(AuditLog log) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", log.getId());
        claims.put("user", log.getUsername());
        claims.put("action", log.getAction());
        claims.put("target", log.getTarget());
        claims.put("serviceName", log.getServiceName()); // Thêm cái này để Frontend hiển thị màu
        claims.put("timestamp", log.getTimestamp().toString());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}