package com.example.identity_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nguoidung")
@Data
public class NguoiDung {

    @Id
    @Column(name = "manguoidung")
    // THÊM 2 DÒNG DƯỚI ĐÂY:
    private String maNguoiDung;

    @Column(name = "tendangnhap")
    private String tenDangNhap;

    @Column(name = "matkhaumahoa")
    private String matKhau;

    @Column(name = "tendaydu")
    private String tenDayDu;


    @Column(name = "trangthaitaikhoan")
    private String trangThai;

    // Liên kết với bảng Phanquyen (Vai trò)
    @ManyToOne 
    @JoinColumn(name = "mavaitro", referencedColumnName = "mavaitro")
    private PhanQuyen vaiTro; // Role

    @Column(name = "ma_khach_hang")
    private String maKhachHang;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "token_expiry_date")
    private LocalDateTime tokenExpiryDate;

    @Column(name = "thoigiantaotaikhoan")
    private LocalDateTime thoigiantaotaikhoan;

}