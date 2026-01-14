package com.example.identity_service.aop;

import com.example.identity_service.service.AuditLogService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLogAspect {

    @Autowired
    private AuditLogService auditLogService;

    // Pointcut: Chạy sau khi bất kỳ hàm nào có @LogAudit thực hiện thành công
    @AfterReturning(pointcut = "@annotation(logAudit)", returning = "result")
    public void logActivity(JoinPoint joinPoint, LogAudit logAudit, Object result) {
        try {
            // 1. Lấy User hiện tại đang đăng nhập
            String username = "Anonymous";
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                username = SecurityContextHolder.getContext().getAuthentication().getName();
            }

            // 2. Lấy Action từ Annotation
            String action = logAudit.action();

            // 3. Lấy thông tin chi tiết (Target)
            // Có thể lấy từ tham số truyền vào hàm (args) hoặc kết quả trả về (result)
            String target = logAudit.description();
            
            // Nếu description rỗng, thử lấy tham số đầu tiên của hàm làm target (VD: ID xóa)
            if (target.isEmpty() && joinPoint.getArgs().length > 0) {
                target = joinPoint.getArgs()[0].toString();
            }

            // 4. Ghi Log (Lưu ý: Nên chạy Async để không block main thread)
            auditLogService.logAction(username, action, target, "IDENTITY-SERVICE");
            
            System.out.println("✅ [AUDIT AOP] Saved log: " + action + " by " + username);

        } catch (Exception e) {
            System.err.println("❌ Lỗi ghi Audit Log: " + e.getMessage());
        }
    }
}