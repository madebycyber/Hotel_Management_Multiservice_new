package com.example.identity_service.service;

import org.springframework.jdbc.core.JdbcTemplate;
import com.example.identity_service.dto.AuthRequest;
import com.example.identity_service.entity.NguoiDung;
import com.example.identity_service.entity.PhanQuyen;
import com.example.identity_service.repository.NguoiDungRepository;
import com.example.identity_service.repository.PhanQuyenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
public class AuthService {

    @Autowired private NguoiDungRepository repository;
    @Autowired private PhanQuyenRepository roleRepo; // Để tìm quyền "USER" mặc định
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JdbcTemplate jdbcTemplate; // Thêm JdbcTemplate
    @Autowired private JwtService jwtService;

public String saveUser(AuthRequest request) {
        // 1. Lấy mã số tiếp theo từ Sequence của Postgres
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_nguoidung_ma')", Long.class);
        
        // 2. Format mã theo định dạng nd001, nd002...
        String generatedId = "nd" + String.format("%03d", nextVal);

        NguoiDung user = new NguoiDung();
        user.setMaNguoiDung(generatedId); // GÁN THỦ CÔNG ID ĐÃ SINH
        user.setTenDangNhap(request.getUsername());
        user.setMatKhau(passwordEncoder.encode(request.getPassword()));
        user.setTenDayDu(request.getFullName());
        user.setTrangThai("Active");
        user.setMaVaiTro("vt002"); // Mặc định là USER

        repository.save(user);
        return "Người dùng đã được đăng ký với mã: " + generatedId;
    }

    // Đăng nhập trả về Token
    public String generateToken(String username) {
        // Mặc định lấy quyền USER cho đơn giản
        return jwtService.generateToken(username, "USER");
    }
}