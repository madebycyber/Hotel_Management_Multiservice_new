package com.example.room_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "phong")
@Data
public class Phong {
    @Id
    @Column(name = "maphong")
    private String maPhong;

    @Column(name = "sophong")
    private Integer soPhong;

    @ManyToOne
    @JoinColumn(name = "maloaiphong")
    private LoaiPhong loaiPhong;

    @Column(name = "trangthai")
    private String trangThai; // Available, Occupied, Maintenance

    @Column(name = "mota")
    private String moTa;
}