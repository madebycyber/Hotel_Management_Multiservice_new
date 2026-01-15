package com.example.identity_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "\"PHANQUYEN\"")
@Data
public class PhanQuyen {
    @Id
    @Column(name = "\"MAVAITRO\"", insertable = false, updatable = false)
    private String maVaiTro;

    @Column(name = "\"TENVAITRO\"")
    private String tenVaiTro;
}