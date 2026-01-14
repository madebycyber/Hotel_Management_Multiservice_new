package com.example.identity_service.dto;

import lombok.Data;

@Data
public class CreateUserDTO {
    private String username;     // tendangnhap
    private String password;     // matkhau (chưa mã hóa)
    private String fullName;     // tendaydu
    private String roleId;       // mavaitro (VD: vt002)
    private String maKhachHang;  // makh (VD: kh001 - Có thể null nếu là Admin)
}