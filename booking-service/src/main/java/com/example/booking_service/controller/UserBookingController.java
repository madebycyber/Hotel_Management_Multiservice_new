package com.example.booking_service.controller;

import com.example.booking_service.dto.UserBookingRequestDTO;
import com.example.booking_service.entity.PhieuDatPhong;
import com.example.booking_service.service.BookingService;
import com.example.booking_service.aop.LogAudit;

import lombok.extern.java.Log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/bookings")
public class UserBookingController {

    @Autowired private BookingService bookingService;

    // 1. API Đặt phòng cho khách (Tự động xử lý khách hàng trùng)
    @PostMapping("/create")
    @LogAudit(action = "CREATE_USER_BOOKING", description = "Khách hàng tạo đặt phòng")
    public ResponseEntity<?> createUserBooking(@RequestBody UserBookingRequestDTO req) {
        try {
            PhieuDatPhong phieu = bookingService.createUserBooking(req);
            return ResponseEntity.ok(phieu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi đặt phòng: " + e.getMessage());
        }
    }

    // 2. API Lấy lịch sử đặt phòng theo Số điện thoại (Để user xem lại phòng đã đặt)
    @GetMapping("/history/{sdt}")
    @LogAudit(action = "GET_USER_BOOKING_HISTORY", description = "Lấy lịch sử đặt phòng của khách hàng")
    public ResponseEntity<?> getBookingHistory(@PathVariable String sdt) {
        return ResponseEntity.ok(bookingService.getHistoryByPhone(sdt));
    }
} 
