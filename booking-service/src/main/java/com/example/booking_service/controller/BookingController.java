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
}