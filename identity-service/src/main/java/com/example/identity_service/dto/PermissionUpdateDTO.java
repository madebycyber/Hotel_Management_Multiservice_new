package com.example.identity_service.dto;

import lombok.Data;

// PermissionUpdateDTO.java
@Data
public class PermissionUpdateDTO {
    private String roleCode;      // VD: vt002
    private String apiEndpoint;   // VD: /api/bookings/**
    private String httpMethod;    // VD: POST
    private boolean enable;       // true = cấp quyền, false = thu hồi
}
