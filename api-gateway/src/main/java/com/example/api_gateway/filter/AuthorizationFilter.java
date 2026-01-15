package com.example.api_gateway.filter;

import com.example.api_gateway.repository.RolePermissionRepository;
import com.example.api_gateway.entity.RolePermission;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Key;
import java.util.List;

@Component
public class AuthorizationFilter implements GlobalFilter, Ordered {

    @Autowired
    private RolePermissionRepository rolePermissionRepo;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String requestPath = exchange.getRequest().getPath().value();
        String method = exchange.getRequest().getMethod().name();

        // 1. Bỏ qua các API Public (Auth, Public)
        if (requestPath.startsWith("/api/auth") || requestPath.startsWith("/api/public")) {
            return chain.filter(exchange);
        }

        // 2. Kiểm tra Header Authorization
        if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
            return onError(exchange, "Thiếu Token", HttpStatus.UNAUTHORIZED);
        }

        String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Token không hợp lệ", HttpStatus.UNAUTHORIZED);
        }

        // 3. Giải mã Token lấy Role
        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String roleCode = claims.get("role", String.class); // Lấy role (vd: vt001)

            // 4. CHECK QUYỀN TRONG DATABASE
            boolean isAllowed = checkPermissionInDB(roleCode, requestPath, method);

            if (!isAllowed) {
                System.out.println("❌ BLOCKED: " + roleCode + " -> " + method + " " + requestPath);
                return onError(exchange, "Không có quyền truy cập (403)", HttpStatus.FORBIDDEN);
            }
            
            System.out.println("✅ ALLOWED: " + roleCode + " -> " + requestPath);

        } catch (Exception e) {
            return onError(exchange, "Lỗi xác thực Token", HttpStatus.UNAUTHORIZED);
        }

        return chain.filter(exchange);
    }

    // Hàm check DB (So khớp đường dẫn)
    private boolean checkPermissionInDB(String roleCode, String path, String method) {
        // Lấy tất cả quyền của Role này
        List<RolePermission> permissions = rolePermissionRepo.findByRolecode(roleCode);

        for (RolePermission p : permissions) {
            // Check Method
            if (p.getHttpmethod().equalsIgnoreCase(method)) {
                // Check Path (Dùng AntPathMatcher để khớp dấu **)
                if (pathMatcher.match(p.getApiendpoint(), path)) {
                    return true;
                }
            }
        }
        return false;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public int getOrder() {
        return -1; // Chạy filter này sớm nhất có thể
    }
}