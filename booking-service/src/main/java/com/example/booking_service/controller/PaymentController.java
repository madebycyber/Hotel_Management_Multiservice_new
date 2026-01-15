package com.example.booking_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.booking_service.dto.*;
import com.example.booking_service.entity.HoaDonThanhToan;
import com.example.booking_service.service.BookingService;
import java.util.List;

@RestController
@RequestMapping("/api/invoices") // Đường dẫn gốc là /api/invoices
public class PaymentController {
    
    @Autowired private BookingService service;

    // 1. API Lấy danh sách hóa đơn (Phân trang)
    // Frontend gọi: GET /api/invoices?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<HoaDonThanhToan>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.getAllInvoices(page, size));
    }

    // 2. API Tạo hóa đơn (Thanh toán & Check-out)
    // Frontend gọi: POST /api/invoices
    @PostMapping
    public ResponseEntity<?> createInvoice(@RequestBody PaymentRequestDTO req) {
        try {
            return ResponseEntity.ok(service.createInvoice(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. API Thống kê Doanh thu (Cho biểu đồ Dashboard sau này)
    // Frontend gọi: GET /api/invoices/revenue
    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDTO>> getRevenueStats() {
        return ResponseEntity.ok(service.getRevenueStats());
    }
}