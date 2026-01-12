package com.example.booking_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
// Import Feign
import org.springframework.cloud.openfeign.EnableFeignClients;

// Import JPA config (Giữ nguyên như lần trước để đảm bảo Repo hoạt động)
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableDiscoveryClient

// --- SỬA DÒNG NÀY ---
// Chỉ định rõ thư mục chứa RoomClient để Spring tìm thấy nó
@EnableFeignClients(basePackages = "com.example.booking_service.client") 
// --------------------

@EnableJpaRepositories(basePackages = "com.example.booking_service.repository")
@EntityScan(basePackages = "com.example.booking_service.entity")
public class BookingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingServiceApplication.class, args);
    }
}