package com.example.identity_service.controller;

import com.example.identity_service.dto.AuthRequest;
import com.example.identity_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private AuthService service;
    @Autowired private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public String addNewUser(@RequestBody AuthRequest request) {
        return service.saveUser(request);
    }

    @PostMapping("/login")
    public String getToken(@RequestBody AuthRequest request) {
        Authentication authenticate = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        if (authenticate.isAuthenticated()) {
            return service.generateToken(request.getUsername());
        } else {
            throw new RuntimeException("Sai thông tin đăng nhập!");
        }
    }
}