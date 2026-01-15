package com.example.room_service.controller;

import java.io.IOException;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.example.room_service.dto.RoomRequestDTO; // Import DTO
import com.example.room_service.entity.*;
import com.example.room_service.service.RoomService;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api")
public class RoomController {
    @Autowired private RoomService roomService;

    @GetMapping("/rooms")
    public ResponseEntity<Page<Phong>> getAllRooms(
            @RequestParam(defaultValue = "0") int page, // Mặc định trang 0
            @RequestParam(defaultValue = "10") int size // Mặc định 10 dòng
    ) {
        return ResponseEntity.ok(roomService.getAllRooms(page, size));
    }

// SỬA: Thêm tham số file ảnh và đổi thành @ModelAttribute
    @PostMapping(value = "/rooms", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRoom(
            @ModelAttribute RoomRequestDTO roomDTO, // Dữ liệu text (số phòng, loại...)
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile // File ảnh
    ) {
        try {
            return ResponseEntity.ok(roomService.createRoom(roomDTO, imageFile));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi khi lưu ảnh: " + e.getMessage());
        }
    }

    @GetMapping("/rooms/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(roomService.getRoomStats());
    }

    // --- LOẠI PHÒNG (Cần thiết cho dropdown frontend) ---
    @GetMapping("/loai-phong")
    public ResponseEntity<Page<LoaiPhong>> getAllLoaiPhong(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(roomService.getAllLoaiPhong(page, size));
    }

    @PostMapping("/loai-phong")
    public ResponseEntity<?> createLoaiPhong(@RequestBody LoaiPhong loaiPhong) {
        return ResponseEntity.ok(roomService.createLoaiPhong(loaiPhong));
    }

    @GetMapping("/dich-vu")
    public ResponseEntity<Page<DichVu>> getAllDichVu(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(roomService.getAllDichVu(page, size));
    }

    @PostMapping("/dich-vu")
    public ResponseEntity<?> createDichVu(@RequestBody DichVu dichVu) {
        try{
            if(dichVu.getGiaTien() < 0){
                throw new RuntimeException("Giá tiền dịch vụ không được âm.");
            }
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
        try{
            return ResponseEntity.ok(roomService.createDichVu(dichVu));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }

    }
    @GetMapping("/rooms/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable String id) {
        try {
            // Gọi service để tìm phòng (nên dùng hàm tìm kiếm không phân biệt hoa thường)
            return ResponseEntity.ok(roomService.getRoomById(id));
        } catch (RuntimeException e) {
            // Trả về 404 nếu không tìm thấy (để Booking Service bắt được lỗi FeignException.NotFound)
            return ResponseEntity.notFound().build();
        }
    }
}