package com.example.booking_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF để cho phép POST/PUT
            .authorizeHttpRequests(auth -> auth
                // Cho phép tất cả request đi qua (Vì Gateway đã chặn ở ngoài rồi)
                .anyRequest().permitAll()
            )
            // QUAN TRỌNG: Tắt Form Login mặc định (nguyên nhân gây redirect /login)
            .formLogin(login -> login.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}