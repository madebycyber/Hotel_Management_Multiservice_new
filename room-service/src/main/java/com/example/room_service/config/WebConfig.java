package com.example.room_service.config; // Nhớ sửa dòng này cho đúng tên project của bạn

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cấu hình để đường dẫn /images/** trỏ vào thư mục uploads/ ở gốc project
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/");
    }
}