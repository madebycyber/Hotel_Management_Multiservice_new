package com.example.identity_service.entity;

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

    @Column(name = "mavaitro")
    private String maVaiTro;

    @Column(name = "trangthaitaikhoan")
    private String trangThai;
}