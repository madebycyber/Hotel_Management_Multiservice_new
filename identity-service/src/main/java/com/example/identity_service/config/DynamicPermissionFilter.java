package com.example.identity_service.config; // Hoặc package chứa filter của bạn

import com.example.identity_service.entity.RolePermission;
import com.example.identity_service.repository.RolePermissionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class DynamicPermissionFilter extends OncePerRequestFilter {

    @Autowired
    private RolePermissionRepository rolePermissionRepo;

    // Công cụ giúp so sánh URL (ví dụ: /api/users/** khớp với /api/users/profile)
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();

        // 1. Bỏ qua các API Public (Không cần check quyền)
        if (requestURI.startsWith("/api/auth") || requestURI.startsWith("/api/public")) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 2. Chỉ kiểm tra khi User đã đăng nhập
        if (auth != null && auth.isAuthenticated()) {
            
            // Lấy Role Code (Xóa tiền tố ROLE_ nếu có để khớp với DB: vt001, vt002...)
            String roleCode = auth.getAuthorities().stream()
                    .findFirst()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .orElse("UNKNOWN");

            // --- LOG DEBUG: BẮT ĐẦU KIỂM TRA ---
            System.out.println("\n========== [FILTER START] ==========");
            System.out.println(">> User: " + auth.getName() + " | Role: " + roleCode);
            System.out.println(">> Request: [" + method + "] " + requestURI);

            // Lấy danh sách quyền từ Database
            List<RolePermission> permissions = rolePermissionRepo.findByRolecode(roleCode);
            
            if (permissions.isEmpty()) {
                System.err.println("!! CẢNH BÁO: Role '" + roleCode + "' chưa được cấu hình quyền nào trong bảng 'rolepermissions'!");
            }

            boolean isAllowed = false;
            for (RolePermission perm : permissions) {
                // Check Method (GET, POST...)
                boolean methodMatch = perm.getHttpmethod().equalsIgnoreCase(method);
                // Check URL Pattern
                boolean pathMatch = pathMatcher.match(perm.getApiendpoint(), requestURI);

                // In thử từng dòng so sánh để debug
                // System.out.println("   Checking vs: [" + perm.getHttpmethod() + "] " + perm.getApiendpoint() + " -> " + (methodMatch && pathMatch));

                if (methodMatch && pathMatch) {
                    isAllowed = true;
                    System.out.println(">> KẾT QUẢ: KHỚP QUYỀN! (" + perm.getApiendpoint() + ")");
                    break;
                }
            }

            if (!isAllowed) {
                // --- LOG DEBUG: CHẶN REQUEST ---
                System.err.println(">> KẾT QUẢ: BỊ CHẶN (BLOCK) !!!");
                System.err.println(">> Lý do: Không tìm thấy dòng nào trong bảng 'rolepermissions' cho phép Role '" + roleCode + "' truy cập API này.");
                System.out.println("====================================\n");
                
                // Trả về lỗi 403 Forbidden
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied by DynamicPermissionFilter");
                return; // Dừng luôn, không cho đi tiếp vào Controller
            }
            
            System.out.println("========== [FILTER PASS] ==========\n");
        }

        // Nếu hợp lệ (hoặc chưa đăng nhập - để SecurityConfig xử lý tiếp), cho đi tiếp
        filterChain.doFilter(request, response);
    }
}