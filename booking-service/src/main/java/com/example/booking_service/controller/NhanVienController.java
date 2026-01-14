package com.example.booking_service.controller;

import com.example.booking_service.entity.NhanVien;
import com.example.booking_service.aop.LogAudit;
import com.example.booking_service.repository.NhanVienRepository;

import lombok.extern.java.Log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class NhanVienController {

    @Autowired private NhanVienRepository repo;
    @Autowired private JdbcTemplate jdbcTemplate;

    // Lấy danh sách phân trang
    @GetMapping
    public ResponseEntity<Page<NhanVien>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(repo.findAll(pageable));
    }

    // Lấy tất cả (cho dropdown chọn nhân viên thu ngân nếu cần)
    @GetMapping("/list")
    public ResponseEntity<List<NhanVien>> getList() {
        return ResponseEntity.ok(repo.findAll());
    }

    // Thêm nhân viên
    @PostMapping
    @LogAudit(action = "CREATE_EMPLOYEE", description = "Tạo mới nhân viên")
    public ResponseEntity<?> create(@RequestBody NhanVien nv) {
        if (nv.getMaNv() == null || nv.getMaNv().isEmpty()) {
            Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_nhanvien_ma')", Long.class);
            nv.setMaNv("nv" + String.format("%03d", nextVal));
        }
        return ResponseEntity.ok(repo.save(nv));
    }

    // Sửa nhân viên
    @PutMapping("/{id}")
    @LogAudit(action = "UPDATE_EMPLOYEE", description = "Cập nhật thông tin nhân viên")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody NhanVien nv) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        nv.setMaNv(id);
        return ResponseEntity.ok(repo.save(nv));
    }

    // Xóa nhân viên
    @DeleteMapping("/{id}")
    @LogAudit(action = "DELETE_EMPLOYEE", description = "Xóa nhân viên")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            repo.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa nhân viên đã lập hóa đơn!");
        }
    }
}