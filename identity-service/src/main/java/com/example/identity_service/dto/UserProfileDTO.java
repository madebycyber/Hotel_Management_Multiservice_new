package com.example.identity_service.dto;

import lombok.Data;
import java.util.List;
@Data
public class UserProfileDTO {
    private String maNguoiDung;
    private String tenDangNhap;
    private String tenDayDu;
    private String email;
    private String tenVaiTro;     // VD: ADMIN
    private String maVaiTro;      // VD: vt001
    private String maKhachHang;   // VD: kh001
    private List<String> permissions; // Danh sách API được phép gọi
}
