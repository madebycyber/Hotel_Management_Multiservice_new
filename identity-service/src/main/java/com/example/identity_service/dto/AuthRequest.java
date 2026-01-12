package com.example.identity_service.dto;
import lombok.Data;
@Data
public class AuthRequest {
    private String username;
    private String password;
    private String fullName; // Dùng cho Register
}