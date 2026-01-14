package com.example.identity_service.controller;

import com.example.identity_service.dto.AuthRequest;
import com.example.identity_service.dto.CreateUserDTO;
import com.example.identity_service.dto.UserProfileDTO;
import com.example.identity_service.dto.PermissionUpdateDTO;
import com.example.identity_service.entity.NguoiDung;
import com.example.identity_service.entity.PhanQuyen;
import com.example.identity_service.entity.RolePermission;
import com.example.identity_service.repository.KhachHangRepository;
import com.example.identity_service.repository.NguoiDungRepository;
import com.example.identity_service.repository.PhanQuyenRepository;
import com.example.identity_service.repository.RolePermissionRepository;
import com.example.identity_service.service.AuthService;

import java.time.LocalDateTime;
import java.util.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/permissions")
public class PermissionController {

    @Autowired private RolePermissionRepository rolePermRepo;
    @Autowired private PhanQuyenRepository phanQuyenRepo; // Repo bảng Roles
    @Autowired private NguoiDungRepository nguoiDungRepo;

    // 1. Lấy tất cả Roles
    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(phanQuyenRepo.findAll());
    }

    // 2. Lấy tất cả cấu hình quyền hiện tại
    @GetMapping("/list")
    public ResponseEntity<?> getAllPermissions() {
        return ResponseEntity.ok(rolePermRepo.findAll());
    }

    // 3. Cập nhật quyền (Thêm hoặc Xóa)
    @PostMapping("/update")
    // @PreAuthorize("hasAuthority('ADMIN')") // Chỉ Admin được gọi
    public ResponseEntity<?> updatePermission(@RequestBody PermissionUpdateDTO req) {
        
        if (req.isEnable()) {
            // Cấp quyền: Kiểm tra nếu chưa có thì thêm
            boolean exists = rolePermRepo.existsByRolecodeAndApiendpointAndHttpmethod(
                    req.getRoleCode(), req.getApiEndpoint(), req.getHttpMethod());
            
            if (!exists) {
                RolePermission newPerm = new RolePermission();
                newPerm.setRolecode(req.getRoleCode());
                newPerm.setApiendpoint(req.getApiEndpoint());
                newPerm.setHttpmethod(req.getHttpMethod());
                rolePermRepo.save(newPerm);
            }
        } else {
            // Thu hồi quyền: Xóa khỏi DB
            List<RolePermission> perms = rolePermRepo.findByRolecode(req.getRoleCode());
            for (RolePermission p : perms) {
                if (p.getApiendpoint().equals(req.getApiEndpoint()) 
                    && p.getHttpmethod().equals(req.getHttpMethod())) {
                    rolePermRepo.delete(p);
                }
            }
        }
        return ResponseEntity.ok("Cập nhật thành công");
    }

    @PostMapping("/roles/create")
    public ResponseEntity<?> createRole(@RequestBody PhanQuyen role) {
        if (phanQuyenRepo.existsById(role.getMaVaiTro())) {
            return ResponseEntity.badRequest().body("Mã vai trò đã tồn tại");
        }
        phanQuyenRepo.save(role);
        return ResponseEntity.ok(role);
    }


}
