package com.example.booking_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nhanvien")
@Data
public class NhanVien {
    @Id
    @Column(name = "manv")
    private String maNv;

    @Column(name = "stt", insertable = false, updatable = false)
    private Long stt;

    @Column(name = "tennv")
    private String tenNv;

    @Column(name = "email")
    private String email;

    @Column(name = "sdt")
    private String sdt;

    @Column(name = "diachi")
    private String diaChi;
}