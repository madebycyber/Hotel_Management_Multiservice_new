package com.example.booking_service.entity;
import jakarta.persistence.*;  // Import toàn bộ JPA (Entity, Table, Id, Column...)
import lombok.Data;            // Import Lombok
@Entity
@Table(name = "\"CHITIETDATPHONG\"")
@Data
public class ChiTietDatPhong {
    @Id
    @Column(name = "\"MACTDP\"", insertable = false, updatable = false)
    private String maCTDP;

    @Column(name = "\"MADATPHONG\"")
    private String maDatPhong;

    @Column(name = "\"MADV\"")
    private String maDichVu; // Chỉ lưu String

    @Column(name = "\"SOLUONG\"")
    private Integer soLuong;
}