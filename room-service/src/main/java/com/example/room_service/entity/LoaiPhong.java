package com.example.room_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "loaiphong")
@Data
public class LoaiPhong {
    @Id
    @Column(name = "maloaiphong")
    private String maLoaiPhong;

    @Column(name = "tenloaiphong")
    private String tenLoaiPhong;

    @Column(name = "gia")
    private BigDecimal gia;
}