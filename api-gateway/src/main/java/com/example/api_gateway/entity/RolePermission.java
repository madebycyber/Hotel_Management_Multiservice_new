package com.example.api_gateway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rolepermissions")
@Data
public class RolePermission {
    @Id
    @Column(name = "id", insertable = false, updatable = false)
    private Integer id;

    @Column(name = "rolecode")
    private String rolecode;

    @Column(name = "apiendpoint")
    private String apiendpoint;

    @Column(name = "httpmethod")
    private String httpmethod;
}