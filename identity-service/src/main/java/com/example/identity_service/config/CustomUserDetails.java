package com.example.identity_service.config;

import com.example.identity_service.entity.NguoiDung;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    private String name;
    private String password;

    public CustomUserDetails(NguoiDung user) {
        this.name = user.getTenDangNhap();
        this.password = user.getMatKhau();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(); }
    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return name; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}