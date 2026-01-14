package com.example.identity_service.config;

import com.example.identity_service.entity.NguoiDung;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    // Danh sách quyền hạn (Roles)
    private final Collection<? extends GrantedAuthority> authorities;

    // Constructor nhận vào NguoiDung từ DB
    public CustomUserDetails(NguoiDung user) {
        this.username = user.getTenDangNhap();
        this.password = user.getMatKhau();

        // --- ĐOẠN QUAN TRỌNG NHẤT: MAP ROLE TỪ DB SANG AUTHORITY ---
        if (user.getVaiTro() != null) {
            // Lấy mã vai trò (vd: vt001) làm quyền
            this.authorities = Collections.singletonList(
                new SimpleGrantedAuthority(user.getVaiTro().getMaVaiTro()) 
            );
        } else {
            this.authorities = Collections.emptyList();
        }
        // -----------------------------------------------------------
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities; // Trả về danh sách quyền đã map ở trên
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    // Các hàm dưới đây để true mặc định để User luôn hoạt động
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}