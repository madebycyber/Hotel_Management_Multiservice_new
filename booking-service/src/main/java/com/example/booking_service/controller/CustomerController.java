package com.example.booking_service.controller;

import com.example.booking_service.entity.KhachHang;
import com.example.booking_service.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired private KhachHangRepository khachHangRepository;
    @Autowired private JdbcTemplate jdbcTemplate;

    // API Phân trang (Cho trang quản lý)
    @GetMapping
    public ResponseEntity<Page<KhachHang>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(khachHangRepository.findAll(pageable));
    }

    // API List (Cho dropdown đặt phòng)
    @GetMapping("/list")
    public ResponseEntity<List<KhachHang>> getAllCustomers() {
        return ResponseEntity.ok(khachHangRepository.findAll());
    }

    // Tạo mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody KhachHang kh) {
        if (kh.getMaKh() == null || kh.getMaKh().isEmpty()) {
            Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_khachhang_ma')", Long.class);
            kh.setMaKh("kh" + String.format("%03d", nextVal));
        }
        return ResponseEntity.ok(khachHangRepository.save(kh));
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody KhachHang kh) {
        if(!khachHangRepository.existsById(id)) return ResponseEntity.notFound().build();
        kh.setMaKh(id);
        return ResponseEntity.ok(khachHangRepository.save(kh));
    }

    // Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            khachHangRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa khách hàng đang có booking!");
        }
    }
}