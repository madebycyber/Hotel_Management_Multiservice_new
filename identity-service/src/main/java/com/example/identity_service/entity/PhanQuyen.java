package com.example.identity_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "phanquyen")
@Data
public class PhanQuyen {
    @Id
    @Column(name = "mavaitro", insertable = false, updatable = false)
    private String maVaiTro;

    @Column(name = "tenvaitro")
    private String tenVaiTro;
}