package com.example.booking_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                // Lấy Request hiện tại
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    // Lấy Token từ Header Authorization
                    String authHeader = attributes.getRequest().getHeader("Authorization");
                    if (authHeader != null) {
                        // Gắn Token đó vào request Feign gửi đi
                        template.header("Authorization", authHeader);
                    }
                }
            }
        };
    }
}