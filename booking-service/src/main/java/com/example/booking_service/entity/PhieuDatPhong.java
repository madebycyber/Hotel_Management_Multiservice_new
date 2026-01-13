package com.example.booking_service.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "phieudatphong")
@Data
public class PhieuDatPhong {
    @Id
    @Column(name = "madatphong")
    private String maDatPhong;

    @ManyToOne
    @JoinColumn(name = "makh")
    private KhachHang khachHang;

    @Column(name = "maphong")
    private String maPhong; // Lưu ID phòng (String)

    @Column(name = "ngaycheckin")
    private LocalDateTime ngayCheckIn;

    @Column(name = "ngaycheckout")
    private LocalDateTime ngayCheckOut;

    @Column(name = "tonggia")
    private BigDecimal tongGia;

    @Column(name = "trangthaidatphong")
    private String trangThai; // Pending, Confirmed, Cancelled
    
    @Column(name = "thoigiandatphong")
    private LocalDateTime thoiGianDatPhong = LocalDateTime.now();
}