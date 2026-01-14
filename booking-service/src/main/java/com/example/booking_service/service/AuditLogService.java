package com.example.booking_service.service;

import com.example.booking_service.entity.AuditLog;
import com.example.booking_service.repository.AuditLogRepository;
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

    // Dùng chung SECRET KEY với JwtService để đảm bảo tính nhất quán (hoặc dùng key riêng cũng được)
    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    // 1. Hàm ghi log (Gọi hàm này ở bất cứ đâu cần ghi lại hành động)
    public void logAction(String username, String action, String target) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setTarget(target);
        auditLogRepo.save(log);
    }

    // 2. Hàm lấy log và MÃ HÓA thành danh sách JWT
    public List<String> getAllEncryptedLogs() {
        List<AuditLog> logs = auditLogRepo.findAllByOrderByTimestampDesc();

        // Biến đổi từng dòng log entity -> chuỗi JWT
        return logs.stream().map(this::convertLogToJwt).collect(Collectors.toList());
    }

    private String convertLogToJwt(AuditLog log) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", log.getId());
        claims.put("user", log.getUsername());
        claims.put("action", log.getAction());
        claims.put("target", log.getTarget());
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