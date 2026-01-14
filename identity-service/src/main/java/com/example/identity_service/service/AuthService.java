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
        PhanQuyen defaultRole = roleRepo.findById("vt002")
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Không tìm thấy vai trò mặc định vt002"));
        
        user.setVaiTro(defaultRole); // Gán đối tượng Role vào

        repository.save(user);
        return "Người dùng đã được đăng ký với mã: " + generatedId;
    }

    // Sửa lại file AuthService.java
    public String generateToken(String username) {
        // 1. Tìm user trong DB
        NguoiDung user = repository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        
        // 2. Lấy Role Code thật (VD: vt001)
        // Lưu ý: Đảm bảo class NguoiDung của bạn đã map quan hệ @ManyToOne với PhanQuyen
        String roleCode = user.getVaiTro().getMaVaiTro(); 

        // 3. Cấp token với quyền thật
        return jwtService.generateToken(username, roleCode);
    }
}