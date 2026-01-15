package com.example.identity_service.controller;

import com.example.identity_service.dto.AuthRequest;
import com.example.identity_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private AuthService service;
    @Autowired private AuthenticationManager authenticationManager;

<<<<<<< HEAD
=======
    // 1. Đăng ký (Logic cơ bản)
>>>>>>> parent of 0544b01 (UpDocker)
    @PostMapping("/register")
    public String addNewUser(@RequestBody AuthRequest request) {
        return service.saveUser(request);
    }

    @PostMapping("/login")
<<<<<<< HEAD
    public String getToken(@RequestBody AuthRequest request) {
=======
    // Đổi kiểu trả về từ String sang ResponseEntity<?>
    public ResponseEntity<?> getToken(@RequestBody AuthRequest request) {
>>>>>>> parent of 0544b01 (UpDocker)
        Authentication authenticate = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        if (authenticate.isAuthenticated()) {
            return service.generateToken(request.getUsername());
        } else {
            throw new RuntimeException("Sai thông tin đăng nhập!");
        }
    }
<<<<<<< HEAD
=======

    // 3. Tạo User (Admin) - Có gán Role và Khách hàng
    @PostMapping("/create")
    // @PreAuthorize("hasAuthority('MANAGE_USERS')") 
    public ResponseEntity<?> createUser(@RequestBody CreateUserDTO dto) {
        try {
            // A. Validate trùng tên đăng nhập
            if (nguoiDungRepo.existsByTenDangNhap(dto.getUsername())) {
                return ResponseEntity.badRequest().body("Tên đăng nhập '" + dto.getUsername() + "' đã tồn tại!");
            }

            // B. Sinh mã User ID (ndXXX)
            Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_nguoidung_ma')", Long.class);
            String maNguoiDung = "nd" + String.format("%03d", nextVal);

            // C. Khởi tạo User Entity
            NguoiDung user = new NguoiDung();
            user.setMaNguoiDung(maNguoiDung);
            user.setTenDangNhap(dto.getUsername());
            user.setTenDayDu(dto.getFullName());
            // Đã bỏ dòng user.setEmail(...)
            
            // Lưu ý: Kiểm tra tên field trong Entity (trangThai hay trangThaiTaiKhoan)
            user.setTrangThai("Active"); 
            user.setThoigiantaotaikhoan(LocalDateTime.now()); 

            // D. Mã hóa mật khẩu
            user.setMatKhau(passwordEncoder.encode(dto.getPassword()));

            // E. Gán Vai trò (Role)
            PhanQuyen role = phanQuyenRepo.findById(dto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Mã vai trò không tồn tại: " + dto.getRoleId()));
            user.setVaiTro(role);

            // F. Gán Mã Khách Hàng (Optional)
            if (dto.getMaKhachHang() != null && !dto.getMaKhachHang().trim().isEmpty()) {
                if (!khachHangRepo.existsById(dto.getMaKhachHang())) {
                    return ResponseEntity.badRequest().body("Mã khách hàng '" + dto.getMaKhachHang() + "' không tồn tại!");
                }
                user.setMaKhachHang(dto.getMaKhachHang());
            }

            // G. Lưu xuống Database
            NguoiDung savedUser = nguoiDungRepo.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo người dùng: " + e.getMessage());
        }
    }

    // 4. Quên mật khẩu (Trả Token trực tiếp - Không dùng Email)
    @PostMapping("/forgot-password-direct")
    public ResponseEntity<?> forgotPasswordDirect(@RequestParam String username) {
        // Tìm user theo username
        NguoiDung user = nguoiDungRepo.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại: " + username));

        // Tạo Token reset
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setTokenExpiryDate(LocalDateTime.now().plusMinutes(15)); 
        nguoiDungRepo.save(user);

        // Trả token về client
        return ResponseEntity.ok(Map.of(
            "message", "Token đặt lại mật khẩu đã được tạo.",
            "resetToken", token,
            "expiryTime", "15 minutes"
        ));
    }

    // 5. Lấy thông tin cá nhân (Profile)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        
        NguoiDung user = nguoiDungRepo.findByTenDangNhap(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy danh sách quyền từ Role
        String maVaiTro = user.getVaiTro().getMaVaiTro();
        List<String> allowedApis = rolePermRepo.findByRolecode(maVaiTro)
                .stream().map(rp -> rp.getApiendpoint()).toList();

        // Map sang DTO
        UserProfileDTO dto = new UserProfileDTO();
        dto.setMaNguoiDung(user.getMaNguoiDung());
        dto.setTenDangNhap(user.getTenDangNhap());
        dto.setTenDayDu(user.getTenDayDu());
        // Đã bỏ dto.setEmail(...)
        dto.setMaVaiTro(maVaiTro);
        dto.setTenVaiTro(user.getVaiTro().getTenVaiTro());
        dto.setMaKhachHang(user.getMaKhachHang());
        dto.setPermissions(allowedApis);

        return ResponseEntity.ok(dto);
    }
>>>>>>> parent of 0544b01 (UpDocker)
}