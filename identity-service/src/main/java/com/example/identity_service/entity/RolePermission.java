package com.example.identity_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rolepermissions")
@Data
public class RolePermission {
    @Id
    // THÊM DÒNG NÀY: Để báo cho Hibernate biết ID do Database tự sinh (Auto Increment)
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "id") // Xóa bỏ 'insertable = false, updatable = false'
    private Integer id;  // Đổi String thành Integer (hoặc Long) vì Database là số

    @Column(name = "rolecode")
    private String rolecode;

    @Column(name = "apiendpoint")
    private String apiendpoint;

    @Column(name = "httpmethod")
    private String httpmethod;
}