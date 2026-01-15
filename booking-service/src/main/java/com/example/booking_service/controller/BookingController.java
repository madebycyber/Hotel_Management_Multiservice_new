package com.example.booking_service.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.booking_service.dto.BookingRequestDTO;

import com.example.booking_service.service.BookingService;
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired private BookingService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BookingRequestDTO req) {
        return ResponseEntity.ok(service.createBooking(req));
    }
<<<<<<< HEAD
=======

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
    
>>>>>>> parent of 0544b01 (UpDocker)
}