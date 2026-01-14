package com.example.identity_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;  // Import toàn bộ JPA (Entity, Table, Id, Column...)
import lombok.Data;            // Import Lombok

@Entity
@Table(name = "khachhang")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class KhachHang {
    @Id
    @Column(name = "makh")
    private String maKh;
    
    @Column(name = "tenkh")
    private String tenKh;
    private String email;
    private String sdt;
    private String diachi;
}