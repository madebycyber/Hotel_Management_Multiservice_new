package com.example.booking_service.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "\"PHIEUDATPHONG\"")
@Data
public class PhieuDatPhong {
    @Id
    @Column(name = "\"MADATPHONG\"", insertable = false, updatable = false)
    private String maDatPhong; // DB tự sinh DP001

    @Column(name = "\"MAKH\"")
    private String maKhachHang;

    @Column(name = "\"MAPHONG\"")
    private String maPhong; // Chỉ lưu String, KHÔNG mapping @ManyToOne

    @Column(name = "\"NGAYCHECKIN\"")
    private LocalDateTime ngayCheckIn;

    @Column(name = "\"NGAYCHECKOUT\"")
    private LocalDateTime ngayCheckOut;
    
    @Column(name = "\"TONGGIA\"")
    private BigDecimal tongGia;
}