package com.example.identity_service.config;

import com.example.identity_service.config.CustomUserDetailsService;
import com.example.identity_service.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Lấy Header Authorization từ request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. Kiểm tra xem Header có hợp lệ không (phải bắt đầu bằng "Bearer ")
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Cắt bỏ chữ "Bearer " để lấy Token
        jwt = authHeader.substring(7);
        
        // 4. Trích xuất username từ Token
        username = jwtService.extractUsername(jwt);

        // 5. Nếu có username và chưa được xác thực trong Context hiện tại
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // 6. Tải thông tin User từ Database lên (bao gồm cả Role/Authorities)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 7. Kiểm tra Token có hợp lệ với User này không
            if (jwtService.isTokenValid(jwt, userDetails)) {
                
                // 8. Tạo đối tượng Authentication
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities() // QUAN TRỌNG: Nạp quyền vào đây
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 9. Lưu vào SecurityContext (Để các Filter phía sau như DynamicPermissionFilter dùng)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 10. Cho phép request đi tiếp
        filterChain.doFilter(request, response);
    }
}