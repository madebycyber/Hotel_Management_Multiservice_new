package com.example.identity_service.controller;

import com.example.identity_service.dto.CreateUserDTO;
import com.example.identity_service.entity.NguoiDung;
import com.example.identity_service.entity.PhanQuyen;
import com.example.identity_service.repository.NguoiDungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/admin/users") // ĐÚNG đường dẫn Frontend gọi
public class UserController {

    @Autowired
    private NguoiDungRepository nguoiDungRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody CreateUserDTO req) {
        if (nguoiDungRepo.existsByTenDangNhap(req.getUsername())) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại");
        }
        NguoiDung u = new NguoiDung();
        u.setTenDangNhap(req.getUsername());
        u.setMatKhau(passwordEncoder.encode(req.getPassword())); // Mã hóa mật khẩu
        u.setTenDayDu(req.getFullName());
        u.setTrangThai("Active");
        
        // Set Role (Giả sử req gửi lên mã vai trò vt001)
        PhanQuyen role = new PhanQuyen();
        role.setMaVaiTro(req.getRoleId());
        u.setVaiTro(role);

        nguoiDungRepo.save(u);
        return ResponseEntity.ok(u);
    }
    // API lấy danh sách User có phân trang
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page, // Mặc định trang 0
            @RequestParam(defaultValue = "10") int size // Mặc định 10 dòng/trang
    ) {
        Pageable pageable = PageRequest.of(page, size);
        
        // Trả về Page<NguoiDung> thay vì List<NguoiDung>
        Page<NguoiDung> userPage = nguoiDungRepo.findAll(pageable);
        
        // (Tùy chọn) Xóa mật khẩu trước khi trả về Frontend để bảo mật
        userPage.getContent().forEach(u -> u.setMatKhau("HIDDEN"));

        return ResponseEntity.ok(userPage);
    }
    
}