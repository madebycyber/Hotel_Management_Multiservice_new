package com.example.booking_service.aop;

import com.example.booking_service.client.IdentityClient;
import com.example.booking_service.dto.LogDTO;
import com.fasterxml.jackson.databind.ObjectMapper; // Dùng để đọc JSON từ Token
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Base64;
import java.util.Map;

@Aspect
@Component
public class AuditLogAspect {

    @Autowired
    private IdentityClient identityClient;

    // Pointcut: Chạy sau khi bất kỳ hàm nào có @LogAudit thực hiện thành công
    @AfterReturning(pointcut = "@annotation(logAudit)", returning = "result")
    public void logActivity(JoinPoint joinPoint, LogAudit logAudit, Object result) {
        try {
            // --- 1. LOGIC THÔNG MINH ĐỂ LẤY USERNAME ---
            String username = "Anonymous";

            // Cách 1: Thử lấy từ Security Context (nếu service có cấu hình security chuẩn)
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                String ctxUser = SecurityContextHolder.getContext().getAuthentication().getName();
                if (!"anonymousUser".equals(ctxUser)) {
                    username = ctxUser;
                }
            }

            // Cách 2: Nếu vẫn là Anonymous, tự moi Token từ Header và giải mã
            if ("Anonymous".equals(username) || "anonymousUser".equals(username)) {
                username = getUsernameFromToken();
            }
            // ---------------------------------------------

            // 2. Lấy Action từ Annotation
            String action = logAudit.action();

            // 3. Lấy thông tin chi tiết (Target)
            String target = logAudit.description();
            if (target.isEmpty() && joinPoint.getArgs().length > 0) {
                Object arg = joinPoint.getArgs()[0];
                target = (arg != null) ? arg.toString() : "null";
            }

            // 4. Bắn sang Identity
            LogDTO log = new LogDTO();
            log.setUser(username);
            log.setAction(action);
            log.setTarget(target);
            log.setServiceName("BOOKING-SERVICE"); // Nhớ đổi tên theo từng Service

            try {
                identityClient.sendLog(log);
            } catch (Exception e) {
                System.err.println("❌ Không gửi được log sang Identity: " + e.getMessage());
            }

        } catch (Exception e) {
            System.err.println("❌ Lỗi Aspect AuditLog: " + e.getMessage());
        }
    }

    // --- HÀM PHỤ TRỢ: GIẢI MÃ JWT THỦ CÔNG ---
    private String getUsernameFromToken() {
        try {
            // Lấy Request hiện tại
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7); // Bỏ chữ "Bearer "
                
                // JWT có 3 phần: Header.Payload.Signature -> Lấy phần giữa (Payload)
                String[] chunks = token.split("\\.");
                if (chunks.length > 1) {
                    Base64.Decoder decoder = Base64.getUrlDecoder();
                    String payload = new String(decoder.decode(chunks[1]));

                    // Parse JSON payload để lấy field "sub" (subject - tên đăng nhập)
                    ObjectMapper mapper = new ObjectMapper();
                    Map<String, Object> claims = mapper.readValue(payload, Map.class);
                    
                    if (claims.containsKey("sub")) {
                        return (String) claims.get("sub");
                    }
                }
            }
        } catch (Exception e) {
            // Nếu lỗi giải mã thì thôi, chấp nhận là Anonymous
        }
        return "Anonymous";
    }
}