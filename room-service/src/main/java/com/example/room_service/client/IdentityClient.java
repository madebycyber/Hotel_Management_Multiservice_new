package com.example.room_service.client;

import com.example.room_service.dto.LogDTO; // Tạo DTO giống bên Identity
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "IDENTITY-SERVICE") // Tên service trong Eureka
public interface IdentityClient {
    @PostMapping("/api/internal/logs")
    void sendLog(@RequestBody LogDTO logDTO);
}