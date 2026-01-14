package com.example.booking_service.controller;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.ServiceDTO;
import com.example.booking_service.entity.ChiTietDatPhong;
import com.example.booking_service.entity.PhieuDatPhong;
import com.example.booking_service.service.BookingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired private BookingService service;

// API lấy danh sách phân trang
    @GetMapping
    public ResponseEntity<Page<PhieuDatPhong>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.getAllBookings(page, size));
    }

    // API lấy chi tiết dịch vụ của 1 booking
    @GetMapping("/{id}/services")
    public ResponseEntity<List<ChiTietDatPhong>> getBookingServices(@PathVariable String id) {
        return ResponseEntity.ok(service.getServicesByBookingId(id));
    }

    // Create giữ nguyên
    @PostMapping
    public ResponseEntity<?> create(@RequestBody BookingRequestDTO req) {
        return ResponseEntity.ok(service.createBooking(req));
    }

    // Trong BookingController.java
    @PostMapping("/{id}/services")
    public ResponseEntity<?> addServiceToBooking(@PathVariable String id, @RequestBody ServiceDTO serviceDTO) {
        try {
            service.addServiceToBooking(id, serviceDTO);
            return ResponseEntity.ok("Thêm dịch vụ thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/invoice/{bookingId}")
    public ResponseEntity<?> generateInvoice(@PathVariable String bookingId) {
        try {
            return ResponseEntity.ok(service.generateInvoice(bookingId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
}