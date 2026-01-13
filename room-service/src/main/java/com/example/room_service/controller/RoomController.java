package com.example.room_service.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.room_service.dto.RoomRequestDTO; // Import DTO
import com.example.room_service.entity.*;
import com.example.room_service.service.RoomService;

@RestController
@RequestMapping("/api")
public class RoomController {
    @Autowired private RoomService roomService;

    // --- ROOMS ---
    @GetMapping("/rooms")
    public ResponseEntity<List<Phong>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // SỬA ĐỔI: Nhận RoomRequestDTO
    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(@RequestBody RoomRequestDTO roomDTO) {
        try {
            return ResponseEntity.ok(roomService.createRoom(roomDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/rooms/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(roomService.getRoomStats());
    }

    // --- LOẠI PHÒNG (Cần thiết cho dropdown frontend) ---
    @GetMapping("/loai-phong")
    public ResponseEntity<List<LoaiPhong>> getAllLoaiPhong() {
        return ResponseEntity.ok(roomService.getAllLoaiPhong());
    }

    @PostMapping("/loai-phong")
    public ResponseEntity<?> createLoaiPhong(@RequestBody LoaiPhong loaiPhong) {
        return ResponseEntity.ok(roomService.createLoaiPhong(loaiPhong));
    }

    // --- DỊCH VỤ ---
    @GetMapping("/dich-vu")
    public ResponseEntity<List<DichVu>> getAllDichVu() {
        return ResponseEntity.ok(roomService.getAllDichVu());
    }
}